import { withRouter } from "next/router";

import React from "react";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
    };
  }

  render() {
    const { isActive } = this.state;
    const { router } = this.props;

    return (
      <div className="container">
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item" href="https://bulma.io">
              <img
                src="https://bulma.io/images/bulma-logo.png"
                width="112"
                height="28"
              />
            </a>

            <a
              role="button"
              className={
                isActive
                  ? "navbar-burger burger is-active"
                  : "navbar-burger burger"
              }
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
              onClick={() => this.setState({ isActive: !this.state.isActive })}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div
            id="navbarBasicExample"
            className={isActive ? "navbar-menu is-active" : "navbar-menu"}
          >
            <div className="navbar-start">
              {[
                ["/", "Start"],
                ["/karte", "Karte"],
                ["/hintergrund", "Hintergrund"],
                ["/stories", "Stories"],
              ].map((x) => {
                return (
                  <a
                    className={
                      router.pathname === x[0]
                        ? "navbar-item is-active"
                        : "navbar-item"
                    }
                    href={x[0]}
                  >
                    {x[1]}
                  </a>
                );
              })}
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">Mehr</a>

                <div className="navbar-dropdown">
                  <a className="navbar-item">Daten</a>
                  <a className="navbar-item">Kontakt</a>
                  <hr className="navbar-divider" />
                  <a className="navbar-item">Impressum</a>
                  <a className="navbar-item">Datenschutzerklärung</a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default withRouter(NavBar);