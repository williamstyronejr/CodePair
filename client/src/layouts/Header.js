import * as React from 'react';
import { Link } from 'react-router-dom';
import useDetectOutsideClick from '../components/shared/useDetectOutsideClick';
import './styles/header.css';

const Header = () => {
  const navMenuRef = React.useRef(null);
  const [navMenu, setNavMenu] = useDetectOutsideClick(navMenuRef, false);

  return (
    <header className="page-header bg-grad">
      <div className={`menu  ${navMenu ? 'menu--active' : ''} bg-grad`}>
        <button
          className="menu__btn"
          onClick={() => {
            setNavMenu(!navMenu);
          }}
          type="button"
          role="menu"
        >
          <div className="menu__toggle">
            <span className="menu__bar menu__bar--1" />
            <span className="menu__bar menu__bar--2" />
            <span className="menu__bar menu__bar--3" />
          </div>
        </button>

        <div className="menu__content">
          <nav className="menu__nav" role="navigation">
            <ul className="menu__list">
              <li className="menu__item">
                <Link className="menu__link" to="/">
                  Home
                </Link>
              </li>
              <li className="menu__item">
                <Link className="menu__link" to="/challenges">
                  Challenges
                </Link>
              </li>

              <li className="menu__item">
                <Link className="menu__link" to="/roadmap">
                  Roadmap
                </Link>
              </li>

              <li className="menu__item">
                <Link className="menu__link" to="/signin" data-cy="signin">
                  Signin
                </Link>
              </li>

              <li className="menu__item">
                <Link className="menu__link" to="/signup" data-cy="signup">
                  Signup
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
