import "./styles/loading.css";

const Loading = ({ message = "" }: { message?: string }) => (
  <div className="loading loading--full">
    <div className="loading__dots">
      <div />
      <div />
      <div />
      <div />
    </div>
    {message}
  </div>
);

export default Loading;
