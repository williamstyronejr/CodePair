import PropTypes from "prop-types";
import "./styles/loading.css";

const LoadingComponent = ({ message }: { message: string }) => {
  return (
    <div className="loading">
      <div className="loading__dots">
        <div />
        <div />
        <div />
        <div />
      </div>
      {message}
    </div>
  );
};

LoadingComponent.propTypes = {
  message: PropTypes.string,
};

LoadingComponent.defaultProps = {
  message: "",
};

export default LoadingComponent;
