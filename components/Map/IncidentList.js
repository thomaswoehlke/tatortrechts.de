import * as dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Histogram from "./Histogram";
import IncidentBox from "./IncidentBox";

// Hook

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match

  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/

  const [windowSize, setWindowSize] = useState({
    width: undefined,

    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize

    function handleResize() {
      // Set window width/height to state

      setWindowSize({
        width: window.innerWidth,

        height: window.innerHeight,
      });
    }

    // Add event listener

    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size

    handleResize();

    // Remove event listener on cleanup

    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

const Onboarding = ({ hideOnboarding }) => {
  return (
    <>
      <div className="is-flex is-flex-direction-column is-align-items-center is-justify-content-center tor-onboarding-up">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
          />
        </svg>
        <p className="mt-3">Such nach Begriffen</p>
      </div>
      <div className="pt-5 mt-5 is-flex is-align-items-center tor-onboarding-left">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
          />
        </svg>
        <p className="ml-3">Zoom rein</p>
      </div>
      <p
        onClick={hideOnboarding}
        className="is-clickable is-size-7 has-text-grey is-pulled-right tor-onboarding-remove"
      >
        Hinweise ausblenden
      </p>
    </>
  );
};

const OnboardingMobile = ({ hideOnboarding }) => {
  return (
    <>
      <div className="is-flex is-align-items-center tor-onboarding-mobile-up is-size-7">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
          />
        </svg>
        <p className="">Zoom rein</p>
      </div>
      <div className="mr-1 mb-2 is-flex is-align-items-center is-justify-content-flex-end tor-onboarding-mobile-down is-size-7">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
          />
        </svg>
        <p className="">Such nach Begriffen</p>
      </div>
    </>
  );
};

const IncidentList = ({
  setStartDate,
  setStartEndDate,
  sideBarFilter,
  histogram,
  results,
  next,
  count,
  loadMore,
  setHighlight,
  minMaxDate,
  numOrganizations,
  reset,
}) => {
  const containerRef = useRef(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const size = useWindowSize();

  if (count === null) {
    return null;
  }

  const showResults = count !== minMaxDate.total || !showOnboarding;

  return (
    <div id="sidebar-results-outer">
      <div id="sidebar-results" ref={containerRef}>
        {!showResults && (
          <div className="is-hidden-desktop">
            <OnboardingMobile hideOnboarding={() => setShowOnboarding(false)} />
          </div>
        )}
        {sideBarFilter}
        {!showResults && (
          <div className="is-hidden-touch">
            <Onboarding hideOnboarding={() => setShowOnboarding(false)} />
          </div>
        )}
        {(size.width < 1024 || showResults) && (
          <div id="tor-historesults">
            <div className="box tor-histogram">
              {minMaxDate.total === count && (
                <div className="is-size-7">
                  Seit <b>{dayjs(minMaxDate.minDate).format("DD.MM.YYYY")}</b>{" "}
                  haben <b>{numOrganizations}</b> Projekte <b>{count}</b> Fälle
                  mit rechtem Bezug registriert.
                </div>
              )}
              {minMaxDate.total !== count && (
                <div className="is-size-7">
                  Auf deine Auswahl entfallen <b>{count}</b> von{" "}
                  {minMaxDate.total} registrierte Fälle.{" "}
                  <a onClick={() => reset()}>Auswahl zurücksetzen.</a>
                </div>
              )}
              {count === 1 && (
                <div className="is-size-7">
                  Auf deine Auswahl entfällt eine Tat.
                  <a onClick={() => reset()}>Auswahl zurücksetzen.</a>
                </div>
              )}
              <div>
                {histogram && (
                  <Histogram
                    data={histogram}
                    barOnClick={(event, x) => {
                      if (x.index + 1 !== x.data.length) {
                        setStartEndDate(
                          dayjs(x.data[x.index].x),
                          dayjs(x.data[x.index + 1].x)
                        );
                      } else {
                        setStartDate(dayjs(x.data[x.index].x));
                      }
                    }}
                  />
                )}
              </div>
            </div>
            {/* pageStart has to be 1, otherwise there is bug with some left over item. */}
            <InfiniteScroll
              useWindow={false}
              getScrollParent={() => containerRef.current}
              pageStart={0}
              loadMore={loadMore}
              threshold={500}
              hasMore={next != null}
            >
              {results &&
                results.map((x) => (
                  <IncidentBox key={x.id} x={x} setHighlight={setHighlight} />
                ))}
            </InfiniteScroll>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentList;
