import React, { Component } from "react";
import { Link } from "react-router-dom";
import Search from "./search";

class Navbar extends Component {
  render() {
    const { user } = this.props;

    return (
      <header className="navbar-wrapper" role="banner" aria-label="Top Navigation">
        <nav className="navbar-container" role="navigation" aria-label="Main">

          {/* LEFT: brand */}
          <div className="nav-left">
            <Link to="/" className="nav-brand">Barber</Link>
          </div>

          {/* CENTER: links */}
          <ul className="nav-list" role="menubar" aria-label="Primary Links">
            <li className="nav-item" role="none">
              <Link to="/" className="nav-link nav-link--home" role="menuitem">Home</Link>
            </li>

            <li className="nav-item" role="none">
              <Link to="/hairs" className="nav-link nav-link--users" role="menuitem">hairs</Link>
            </li>

            {!user && (
              <>
                <li className="nav-item" role="none">
                  <Link to="/login" className="nav-link nav-link--login" role="menuitem">Login</Link>
                </li>
                <li className="nav-item" role="none">
                  <Link to="/register" className="nav-link nav-link--register" role="menuitem">Register</Link>
                </li>
              </>
            )}

            {user && (
              <>
                <li className="nav-item" role="none">
                  <Link to="/dashboard" className="nav-link nav-link--dashboard" role="menuitem">Dashboard</Link>
                </li>
                <li className="nav-item" role="none">
                  <Link to="/logout" className="nav-link nav-link--logout" role="menuitem">Logout</Link>
                </li>

                {user.is_staff && (
                  <li className="nav-item" role="none">
                    <Link to="/admins" className="nav-link nav-link--admin nav-link--accent" role="menuitem">Admin</Link>
                  </li>
                )}
              </>
            )}
          </ul>

          {/* RIGHT: search OUTSIDE the ul so it can stick to far right */}
          <div className="search-container" role="none">
            <div className="search-wrapper" role="search" aria-label="Site search">
              <Search />
            </div>
          </div>

        </nav>
      </header>
    );
  }
}

export default Navbar;
