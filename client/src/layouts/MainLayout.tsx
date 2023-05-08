import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import Header from "./Header";

const MainLayout = (props: any) => {
  if (props.user.authenticated && props.user.username)
    return <Navigate replace to="/challenges" />;

  return (
    <>
      <Header />

      <main className="page-main">{props.children}</main>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
});

MainLayout.propTypes = {
  user: PropTypes.shape({
    authenticated: PropTypes.bool,
    username: PropTypes.string,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default connect(mapStateToProps, null)(MainLayout);
