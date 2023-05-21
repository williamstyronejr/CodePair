import './styles/loading.css';

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

export default LoadingComponent;
