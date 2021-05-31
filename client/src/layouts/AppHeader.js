import * as React from 'react';
import Proptypes from 'prop-types';
import { Link } from 'react-router-dom';
import useDetectOutsideClick from '../components/shared/useDetectOutsideClick';
import './styles/header.css';

const AppHeader = (props) => {
  const userMenuRef = React.useRef(null);
  const navMenuRef = React.useRef(null);
  const [navMenu, setNavMenu] = useDetectOutsideClick(navMenuRef, false);
  const [userMenu, setUserMenu] = useDetectOutsideClick(userMenuRef, false);

  return (
    <header className="page-header bg-grad">
      <div
        className={`menu ${navMenu ? 'menu--active' : ''}  bg-grad`}
        ref={navMenuRef}
      >
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
            </ul>
          </nav>
        </div>
      </div>

      <div className="header__right">
        <div
          className={`menu  menu--collasped ${
            userMenu ? 'menu--collasped-active' : ''
          }`}
          ref={userMenuRef}
        >
          <button
            className="menu__btn"
            data-cy="menu"
            type="button"
            onClick={() => setUserMenu(!userMenu)}
          >
            <img
              className="menu__img menu__img--toggle"
              src={props.profileImage}
              alt="Profile"
            />
          </button>

          <div className="menu__content bg-grad">
            <nav className="menu__nav">
              <ul className="menu__list">
                <li className="menu__item menu__item--block">
                  <Link className="menu__link" to="/settings">
                    Settings
                  </Link>
                </li>

                <hr className="menu__dividor" />

                <li className="menu__item menu__item--block">
                  <button
                    className="menu__link"
                    type="button"
                    onClick={() => props.signout()}
                    data-cy="signout"
                  >
                    Signout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

AppHeader.propTypes = {
  signout: Proptypes.func.isRequired,
  profileImage: Proptypes.string.isRequired,
};

export default AppHeader;
