import { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useDetectOutsideClick from '../components/shared/useDetectOutsideClick';
import { useAppDispatch, useAppSelector } from '../hooks/reactRedux';
import { signoutUser } from '../reducers/userReducer';
import './styles/header.css';

const AuthHeader = ({
  username,
  signout,
  profileImage,
}: {
  profileImage: string;
  username: string;
  signout: () => void;
}) => {
  const location = useLocation();
  const userMenuRef = useRef(null);
  const navMenuRef = useRef(null);
  const [navMenu, setNavMenu] = useDetectOutsideClick(navMenuRef, false);
  const [userMenu, setUserMenu] = useDetectOutsideClick(userMenuRef, false);

  // Close menus on route change
  useEffect(() => {
    setNavMenu(() => false);
    setUserMenu(false);
  }, [location]);

  return (
    <header className="page-header ">
      <div className="header__container">
        <div
          className={`menu ${navMenu ? 'menu--active' : ''}`}
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
                <li className="menu__item menu__item--heading">
                  <Link to="/" className="menu__link menu__link--logo">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="logo"
                      viewBox="0 0 301.90192 304.28496"
                      version="1.1"
                      id="svg8"
                    >
                      <g
                        id="layer2"
                        transform="translate(56.249792,-33.475482)"
                      >
                        <path
                          d="m 63.078387,330.02214 c -4.719343,-5.99948 -6.02691,-10.82555 -4.790005,-17.67616 1.35266,-7.49088 -1.069211,-14.10764 -11.80637,-32.26213 -7.429206,-12.56125 -12.887904,-23.86627 -12.130589,-25.12239 1.922382,-3.18827 12.540185,-2.85027 18.995585,0.60424 2.968456,1.58859 10.556591,11.71036 16.862473,22.49289 6.305545,10.78238 14.71176,21.0837 18.679788,22.89168 16.891131,7.6962 9.489908,34.43206 -10.075749,36.39636 -7.067444,0.7101 -10.771904,-1.01513 -15.735133,-7.32481 z M 87.01533,324.3846 c 5.474817,-6.59706 1.010529,-16.89446 -7.323881,-16.89446 -10.046845,0 -15.189495,7.0723 -10.929929,15.03111 3.908407,7.30307 12.971443,8.22817 18.25381,1.86335 z m -65.67276,-7.04431 c -4.352083,-2.89053 -31.650644,-47.98612 -31.650644,-52.28492 0,-2.6096 40.374964,-76.55508 44.999935,-82.41608 1.968657,-2.49468 12.857857,12.45558 12.857857,17.65301 0,2.63874 -7.592502,18.20735 -16.872609,34.59686 L 13.804971,264.68834 27.632,288.30937 c 7.60529,12.99169 13.827381,25.36271 13.827381,27.49121 0,4.16841 -14.489039,5.27732 -20.116811,1.53971 z m 89.2854,-1.6923 c -7.1874,-5.7507 -48.333698,-77.99916 -46.297378,-81.29379 2.97408,-4.81233 12.253036,-3.46149 20.435861,2.97508 4.172754,3.28222 14.155016,17.6705 22.182697,31.97402 l 14.59597,26.00631 h 29.99557 c 32.1948,0 35.61083,2.01837 24.66627,14.57422 -4.36796,5.01098 -10.35712,6.40565 -33.21026,7.73381 -19.07297,1.10835 -29.2989,0.48571 -32.36873,-1.96965 z m 76.16734,-35.56414 c -6.45297,-5.076 -12.35363,-6.0903 -35.42969,-6.0903 -15.22816,0 -27.6874,-1.17015 -27.6874,-2.60042 0,-1.43024 3.36034,-6.22635 7.46769,-10.6581 6.87435,-7.41766 9.3991,-8.05745 31.79407,-8.05745 13.37965,0 25.17382,-1.37029 26.20885,-3.04515 3.19472,-5.16913 21.52702,-3.45144 26.9343,2.52365 7.39029,8.16601 6.48347,23.52607 -1.72811,29.27771 -9.14913,6.40829 -18.26441,5.96174 -27.55971,-1.34994 z m 23.66949,-13.70307 c 0,-7.62969 -1.33702,-9.29012 -8.11284,-10.07379 -6.04672,-0.69974 -8.6311,0.69516 -10.14826,5.47515 -2.59601,8.17972 3.62035,15.82585 11.90444,14.64224 4.8311,-0.69054 6.35678,-3.10068 6.35666,-10.0436 z M -38.993024,255.37062 c -11.477437,-9.0283 -9.988029,-23.13558 3.334444,-31.58218 5.945076,-3.76908 15.142308,-15.80571 23.880676,-31.25245 7.8165914,-13.81731 15.2361132,-25.1224 16.4876017,-25.1224 2.8989488,0 9.3434023,14.00127 9.3434023,20.29962 0,2.63308 -4.7961043,12.68264 -10.6579765,22.33236 -6.5334189,10.75507 -10.6759302,21.51546 -10.7045968,27.80463 -0.057525,11.96628 -2.0798125,15.67582 -11.1726607,20.4618 -9.067524,4.77289 -11.068513,4.48595 -20.51089,-2.94138 z m 19.428103,-7.11446 c 8.062549,-9.71482 -3.833254,-24.98497 -13.326501,-17.10642 -6.383232,5.29771 -6.131413,14.37272 0.506405,18.23878 7.143068,4.16041 8.529467,4.03795 12.820441,-1.13237 z m 140.198051,-9.13845 c 0,-0.75859 1.54811,-4.77691 3.4401,-8.92962 4.27257,-9.37705 18.12163,-15.41506 29.0601,-12.66967 4.54188,1.13985 18.24287,1.13676 30.44712,-0.007 l 22.18939,-2.07932 13.84868,-24.00936 c 7.61677,-13.20511 14.68825,-24.00932 15.71477,-24.00932 3.46876,0 9.95638,10.61862 10.05384,16.45567 0.10355,6.01573 -18.59631,41.95995 -26.68359,51.29877 -4.0212,4.64323 -10.62818,5.32899 -51.34267,5.32899 -25.70016,0 -46.72774,-0.6207 -46.72774,-1.37929 z M -50.964665,199.65105 c -2.761289,-4.21412 -5.020544,-9.21225 -5.020544,-11.10689 0,-1.89466 6.163061,-14.75131 13.695832,-28.57033 l 13.695835,-25.12548 34.2651919,-1.97442 c 66.7160591,-3.84424 70.7465981,-2.8857 57.3836121,13.64759 -5.364343,6.63698 -8.578848,7.30582 -41.870706,8.71148 l -36.060294,1.52256 -12.778997,22.52345 c -16.397391,28.90094 -17.239402,29.63693 -23.30993,20.37204 z m 229.944315,-3.45189 c -5.02296,-11.02427 -4.84757,-11.71514 8.64662,-34.08913 6.69929,-11.10763 12.18052,-23.83812 12.18052,-28.2901 0,-17.19322 23.26621,-25.4736 34.07392,-12.1268 3.03211,3.74457 5.51304,10.0289 5.51304,13.96517 0,7.95898 -10.72475,19.57141 -18.08394,19.58074 -2.76348,0.003 -10.49354,10.17586 -18.45778,24.28891 -7.53681,13.3556 -15.19618,24.3154 -17.02085,24.3551 -1.82465,0.0402 -4.90787,-3.41802 -6.85153,-7.68389 z m 47.62449,-53.75576 c 9.11746,-9.11755 -1.23461,-23.50725 -12.41142,-17.25233 -6.06292,3.39291 -7.07389,16.61807 -1.44407,18.88977 6.43598,2.59689 10.04815,2.17004 13.85549,-1.63744 z m -78.45752,40.39606 c -5.59578,-10.45584 -3.32352,-19.54101 10.71276,-42.83217 7.56994,-12.56121 14.51621,-25.79911 15.43648,-29.41754 1.12676,-4.42938 -2.85636,-14.378907 -12.18997,-30.451435 l -13.8634,-23.872454 8.27281,-1.74416 c 12.60476,-2.65759 16.71539,0.869174 32.32451,27.733487 l 14.40653,24.794202 -23.21946,40.8401 c -12.77074,22.46204 -24.4589,40.84008 -25.97363,40.84008 -1.51496,0 -4.17301,-2.65056 -5.90663,-5.89011 z M 108.58715,136.13331 C 104.4741,134.05188 93.44852,120.0264 84.085905,104.96549 L 67.062638,77.582016 37.512879,76.710424 C 5.8537242,75.776683 2.7419772,73.793626 13.291763,61.27547 c 4.577787,-5.43195 8.977429,-6.367233 31.212724,-6.635545 14.236082,-0.171717 28.124345,-0.218668 30.862616,-0.104731 3.047866,0.127294 14.169538,15.664458 28.676327,40.061762 19.00295,31.958354 22.84288,40.395054 19.38241,42.585394 -5.51971,3.49379 -5.91642,3.46569 -14.83869,-1.04941 z M -22.488603,121.73643 c -7.608846,-7.60877 -7.868955,-21.807526 -0.521366,-28.456897 6.945008,-6.285129 22.87995615,-6.554417 27.9278812,-0.471986 2.8765031,3.465958 10.6786908,4.567709 32.3467228,4.567709 17.835121,0 28.556152,1.195233 28.556152,3.183554 0,1.75095 -3.363429,6.54705 -7.474297,10.658 -6.44355,6.4433 -10.32951,7.48782 -28.167601,7.57129 -13.34873,0.0622 -22.7913409,1.68372 -26.6042146,4.56771 -8.2423049,6.23406 -18.8697894,5.57369 -26.0630464,-1.61941 z m 21.1945496,-7.46657 c 6.3411039,-7.64052 2.5730996,-15.372002 -7.4914674,-15.372002 -6.2920722,0 -9.3735392,1.669412 -10.1064582,5.475272 -1.208924,6.27807 4.466038,14.31816 10.1064582,14.31816 2.1021669,0 5.4734289,-1.98964 7.4914674,-4.42143 z m 137.8213434,2.37368 c -2.14475,-0.8618 -7.38391,-8.44313 -11.64289,-16.847352 C 120.62577,91.391918 111.76046,79.241505 105.18421,72.795239 91.650896,59.530078 89.800433,49.034206 99.317051,39.517583 c 14.639829,-14.639922 40.570209,0.936504 33.375469,20.048946 -1.78841,4.751088 0.95299,12.021003 10.91015,28.928848 7.31408,12.420683 13.36,24.295933 13.43549,26.389483 0.13702,3.77648 -12.74183,4.88067 -20.51087,1.75868 z m -14.3716,-63.422816 c 0,-7.603323 -1.22114,-9.135429 -7.28096,-9.135429 -8.51428,0 -14.33527,7.605915 -11.49181,15.015754 1.35486,3.530898 4.66731,4.877555 10.3813,4.22032 7.07931,-0.814275 8.39147,-2.393751 8.39147,-10.100645 z"
                          id="path847"
                        />
                      </g>
                    </svg>
                    <span className="menu__title">CodePair</span>
                  </Link>
                </li>
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
              className="menu__btn menu__btn--user"
              data-cy="menu"
              type="button"
              onClick={() => setUserMenu(!userMenu)}
            >
              <img
                className="menu__img menu__img--toggle"
                src={profileImage}
                alt="Profile"
              />
            </button>

            <div className="menu__content">
              <nav className="menu__nav menu__nav--user">
                <ul className="menu__list menu__list--stack">
                  <li className="menu__item menu__item--block">
                    <Link className="menu__link" to={`/profile/${username}`}>
                      Profile
                    </Link>
                  </li>

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
                      onClick={() => signout()}
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
      </div>
    </header>
  );
};

const UnAuthHeader = () => {
  const navMenuRef = useRef(null);
  const [navMenu, setNavMenu] = useDetectOutsideClick(navMenuRef, false);

  return (
    <header className="page-header">
      <div className="header__container">
        <div className={`menu  ${navMenu ? 'menu--active' : ''}`}>
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
                <li className="menu__item menu__item--heading">
                  <Link to="/" className="menu__link menu__link--logo">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="logo"
                      viewBox="0 0 301.90192 304.28496"
                      version="1.1"
                      id="svg8"
                    >
                      <g
                        id="layer2"
                        transform="translate(56.249792,-33.475482)"
                      >
                        <path
                          d="m 63.078387,330.02214 c -4.719343,-5.99948 -6.02691,-10.82555 -4.790005,-17.67616 1.35266,-7.49088 -1.069211,-14.10764 -11.80637,-32.26213 -7.429206,-12.56125 -12.887904,-23.86627 -12.130589,-25.12239 1.922382,-3.18827 12.540185,-2.85027 18.995585,0.60424 2.968456,1.58859 10.556591,11.71036 16.862473,22.49289 6.305545,10.78238 14.71176,21.0837 18.679788,22.89168 16.891131,7.6962 9.489908,34.43206 -10.075749,36.39636 -7.067444,0.7101 -10.771904,-1.01513 -15.735133,-7.32481 z M 87.01533,324.3846 c 5.474817,-6.59706 1.010529,-16.89446 -7.323881,-16.89446 -10.046845,0 -15.189495,7.0723 -10.929929,15.03111 3.908407,7.30307 12.971443,8.22817 18.25381,1.86335 z m -65.67276,-7.04431 c -4.352083,-2.89053 -31.650644,-47.98612 -31.650644,-52.28492 0,-2.6096 40.374964,-76.55508 44.999935,-82.41608 1.968657,-2.49468 12.857857,12.45558 12.857857,17.65301 0,2.63874 -7.592502,18.20735 -16.872609,34.59686 L 13.804971,264.68834 27.632,288.30937 c 7.60529,12.99169 13.827381,25.36271 13.827381,27.49121 0,4.16841 -14.489039,5.27732 -20.116811,1.53971 z m 89.2854,-1.6923 c -7.1874,-5.7507 -48.333698,-77.99916 -46.297378,-81.29379 2.97408,-4.81233 12.253036,-3.46149 20.435861,2.97508 4.172754,3.28222 14.155016,17.6705 22.182697,31.97402 l 14.59597,26.00631 h 29.99557 c 32.1948,0 35.61083,2.01837 24.66627,14.57422 -4.36796,5.01098 -10.35712,6.40565 -33.21026,7.73381 -19.07297,1.10835 -29.2989,0.48571 -32.36873,-1.96965 z m 76.16734,-35.56414 c -6.45297,-5.076 -12.35363,-6.0903 -35.42969,-6.0903 -15.22816,0 -27.6874,-1.17015 -27.6874,-2.60042 0,-1.43024 3.36034,-6.22635 7.46769,-10.6581 6.87435,-7.41766 9.3991,-8.05745 31.79407,-8.05745 13.37965,0 25.17382,-1.37029 26.20885,-3.04515 3.19472,-5.16913 21.52702,-3.45144 26.9343,2.52365 7.39029,8.16601 6.48347,23.52607 -1.72811,29.27771 -9.14913,6.40829 -18.26441,5.96174 -27.55971,-1.34994 z m 23.66949,-13.70307 c 0,-7.62969 -1.33702,-9.29012 -8.11284,-10.07379 -6.04672,-0.69974 -8.6311,0.69516 -10.14826,5.47515 -2.59601,8.17972 3.62035,15.82585 11.90444,14.64224 4.8311,-0.69054 6.35678,-3.10068 6.35666,-10.0436 z M -38.993024,255.37062 c -11.477437,-9.0283 -9.988029,-23.13558 3.334444,-31.58218 5.945076,-3.76908 15.142308,-15.80571 23.880676,-31.25245 7.8165914,-13.81731 15.2361132,-25.1224 16.4876017,-25.1224 2.8989488,0 9.3434023,14.00127 9.3434023,20.29962 0,2.63308 -4.7961043,12.68264 -10.6579765,22.33236 -6.5334189,10.75507 -10.6759302,21.51546 -10.7045968,27.80463 -0.057525,11.96628 -2.0798125,15.67582 -11.1726607,20.4618 -9.067524,4.77289 -11.068513,4.48595 -20.51089,-2.94138 z m 19.428103,-7.11446 c 8.062549,-9.71482 -3.833254,-24.98497 -13.326501,-17.10642 -6.383232,5.29771 -6.131413,14.37272 0.506405,18.23878 7.143068,4.16041 8.529467,4.03795 12.820441,-1.13237 z m 140.198051,-9.13845 c 0,-0.75859 1.54811,-4.77691 3.4401,-8.92962 4.27257,-9.37705 18.12163,-15.41506 29.0601,-12.66967 4.54188,1.13985 18.24287,1.13676 30.44712,-0.007 l 22.18939,-2.07932 13.84868,-24.00936 c 7.61677,-13.20511 14.68825,-24.00932 15.71477,-24.00932 3.46876,0 9.95638,10.61862 10.05384,16.45567 0.10355,6.01573 -18.59631,41.95995 -26.68359,51.29877 -4.0212,4.64323 -10.62818,5.32899 -51.34267,5.32899 -25.70016,0 -46.72774,-0.6207 -46.72774,-1.37929 z M -50.964665,199.65105 c -2.761289,-4.21412 -5.020544,-9.21225 -5.020544,-11.10689 0,-1.89466 6.163061,-14.75131 13.695832,-28.57033 l 13.695835,-25.12548 34.2651919,-1.97442 c 66.7160591,-3.84424 70.7465981,-2.8857 57.3836121,13.64759 -5.364343,6.63698 -8.578848,7.30582 -41.870706,8.71148 l -36.060294,1.52256 -12.778997,22.52345 c -16.397391,28.90094 -17.239402,29.63693 -23.30993,20.37204 z m 229.944315,-3.45189 c -5.02296,-11.02427 -4.84757,-11.71514 8.64662,-34.08913 6.69929,-11.10763 12.18052,-23.83812 12.18052,-28.2901 0,-17.19322 23.26621,-25.4736 34.07392,-12.1268 3.03211,3.74457 5.51304,10.0289 5.51304,13.96517 0,7.95898 -10.72475,19.57141 -18.08394,19.58074 -2.76348,0.003 -10.49354,10.17586 -18.45778,24.28891 -7.53681,13.3556 -15.19618,24.3154 -17.02085,24.3551 -1.82465,0.0402 -4.90787,-3.41802 -6.85153,-7.68389 z m 47.62449,-53.75576 c 9.11746,-9.11755 -1.23461,-23.50725 -12.41142,-17.25233 -6.06292,3.39291 -7.07389,16.61807 -1.44407,18.88977 6.43598,2.59689 10.04815,2.17004 13.85549,-1.63744 z m -78.45752,40.39606 c -5.59578,-10.45584 -3.32352,-19.54101 10.71276,-42.83217 7.56994,-12.56121 14.51621,-25.79911 15.43648,-29.41754 1.12676,-4.42938 -2.85636,-14.378907 -12.18997,-30.451435 l -13.8634,-23.872454 8.27281,-1.74416 c 12.60476,-2.65759 16.71539,0.869174 32.32451,27.733487 l 14.40653,24.794202 -23.21946,40.8401 c -12.77074,22.46204 -24.4589,40.84008 -25.97363,40.84008 -1.51496,0 -4.17301,-2.65056 -5.90663,-5.89011 z M 108.58715,136.13331 C 104.4741,134.05188 93.44852,120.0264 84.085905,104.96549 L 67.062638,77.582016 37.512879,76.710424 C 5.8537242,75.776683 2.7419772,73.793626 13.291763,61.27547 c 4.577787,-5.43195 8.977429,-6.367233 31.212724,-6.635545 14.236082,-0.171717 28.124345,-0.218668 30.862616,-0.104731 3.047866,0.127294 14.169538,15.664458 28.676327,40.061762 19.00295,31.958354 22.84288,40.395054 19.38241,42.585394 -5.51971,3.49379 -5.91642,3.46569 -14.83869,-1.04941 z M -22.488603,121.73643 c -7.608846,-7.60877 -7.868955,-21.807526 -0.521366,-28.456897 6.945008,-6.285129 22.87995615,-6.554417 27.9278812,-0.471986 2.8765031,3.465958 10.6786908,4.567709 32.3467228,4.567709 17.835121,0 28.556152,1.195233 28.556152,3.183554 0,1.75095 -3.363429,6.54705 -7.474297,10.658 -6.44355,6.4433 -10.32951,7.48782 -28.167601,7.57129 -13.34873,0.0622 -22.7913409,1.68372 -26.6042146,4.56771 -8.2423049,6.23406 -18.8697894,5.57369 -26.0630464,-1.61941 z m 21.1945496,-7.46657 c 6.3411039,-7.64052 2.5730996,-15.372002 -7.4914674,-15.372002 -6.2920722,0 -9.3735392,1.669412 -10.1064582,5.475272 -1.208924,6.27807 4.466038,14.31816 10.1064582,14.31816 2.1021669,0 5.4734289,-1.98964 7.4914674,-4.42143 z m 137.8213434,2.37368 c -2.14475,-0.8618 -7.38391,-8.44313 -11.64289,-16.847352 C 120.62577,91.391918 111.76046,79.241505 105.18421,72.795239 91.650896,59.530078 89.800433,49.034206 99.317051,39.517583 c 14.639829,-14.639922 40.570209,0.936504 33.375469,20.048946 -1.78841,4.751088 0.95299,12.021003 10.91015,28.928848 7.31408,12.420683 13.36,24.295933 13.43549,26.389483 0.13702,3.77648 -12.74183,4.88067 -20.51087,1.75868 z m -14.3716,-63.422816 c 0,-7.603323 -1.22114,-9.135429 -7.28096,-9.135429 -8.51428,0 -14.33527,7.605915 -11.49181,15.015754 1.35486,3.530898 4.66731,4.877555 10.3813,4.22032 7.07931,-0.814275 8.39147,-2.393751 8.39147,-10.100645 z"
                          id="path847"
                        />
                      </g>
                    </svg>
                    <span className="menu__title">CodePair</span>
                  </Link>
                </li>
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
      </div>
    </header>
  );
};

const Header = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return user.authenticated ? (
    <AuthHeader
      username={user.username || ''}
      profileImage={user.profileImage}
      signout={() => dispatch(signoutUser())}
    />
  ) : (
    <UnAuthHeader />
  );
};

export default Header;
