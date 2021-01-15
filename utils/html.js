import cheerio from "cheerio";
import ky from "ky-universal";
import { API_LOCATION, fetchChildPages } from "./networking";

async function imageToHtml(imgId, className = null) {
  const url = API_LOCATION + `/content/api/v2/images/${imgId}/`;
  const apiResponse = await ky.get(url).json();
  const src = API_LOCATION + apiResponse.meta.download_url;
  const { title } = apiResponse;
  const { caption } = apiResponse.meta;
  //   if (className === null) return `<img src="${src}" alt="${title}" />`;
  return `<div class="level">
  <div class="level-item has-text-centered">
    <figure class='image'>
    <img src="${src}" alt="${title}" class="${className}" />
    <figcaption>${caption}</figcaption>
    </figure>
  </div>
</div>`;
}

// the HTML provided by wagtail is garbage, need to replace the images
async function fixHtml(html) {
  const $ = cheerio.load(html);

  // wasn't working with replaceWith
  await Promise.all(
    $("embed").map(async function () {
      const imageId = $(this).attr("id");
      const className = $(this).attr("format");
      let fixedClass = null;
      //   if (className === "left") fixedClass = "is-pulled-left";
      //   if (className === "right") fixedClass = "is-pulled-right";
      //   if (className === "fullwidth") fixedClass = "is-fullwidth";
      fixedClass = "is-centered";
      const newImage = await imageToHtml(imageId, fixedClass);
      $(this).before(newImage);
      $(this).remove();
      return;
    })
  );

  return $("body").html();
}

async function renderListChildPages(parentPageId) {
  const items = await fetchChildPages(parentPageId);
  const posts = items.map(({ title, url, thumbnail_url, date, teaser }) => {
    return `<div class="column is-6"><a href="${url}"><div class="card">
    <div class="card-image">
      <figure class="image is-2by1">
        <img src="${thumbnail_url}" alt="${title}">
      </figure>
    </div>
    <div class="card-content">
    <p class="">${date}</p>
      <p class="title is-3">${title}</p>
    </div>
    <div class="card-content">
    ${teaser}
    </div>
  </div></a></div>`;
  });
  // const tposts = [posts[0], posts[0], posts[0], posts[0], posts[0], posts[0]];
  return `<div class="columns is-multiline">${posts.join("")}</div>`;
}

async function transformToHtml(content, layout = null) {
  const contentList = await Promise.all(
    content.map(async (x) => {
      if (x.type === "heading") {
        return `<h1 class="title">${x.value}</h1>`;
      }

      if (x.type === "image") {
        return imageToHtml(x.value);
      }

      if (x.type === "paragraph") {
        const fixedHtml = await fixHtml(x.value);
        return `<div class="content">${fixedHtml}</div>`;
      }

      if (x.type === "raw_html") {
        return x.value;
      }

      if (x.type === "list_child_pages") {
        return renderListChildPages(x.value);
      }

      if (x.type === "quote") {
        const fixedHtml = await fixHtml(x.value.quote);
        let optauthor = "";
        if (x.value.author)
          optauthor = `<p class="has-text-right">${x.value.author}</p>`;
        return `<div class="content"><blockquote>${fixedHtml}</blockquote>${optauthor}</div>`;
      }

      if (x.type === "two_columns") {
        const left = await transformToHtml(x.value.left_column);
        const right = await transformToHtml(x.value.right_column);

        return `<div class="columns is-desktop"><div class="column">${left}</div><div class="column">${right}</div></div>`;
      }

      if (x.type === "centered_column") {
        const column = await transformToHtml(x.value.column);
        const columnSize = x.value.column_size;
        return `<div class="columns is-centered"><div class="column is-${columnSize}">${column}</div></div>`;
      }

      console.error("problem with " + x.type);
    })
  );

  if (layout === "FC") {
    return `<section class="section"><div class="container">
      ${contentList.join("")}
      </div></section>`;
  }

  if (layout === "CM") {
    return `
    <section class="section">
    <div class="container">
    <div class="columns is-centered">
    <div class="column is-7">
    ${contentList.join("")}
    </div>
    </div>
    </div>
    </section>`;
  }

  // for inner column content, this is important! Do not remove!
  return contentList.join("");
}

export { transformToHtml };