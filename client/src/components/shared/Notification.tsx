import { FC } from "react";
import "./styles/notification.css";

const Notification: FC<{ type: string; message: string }> = ({
  type = "",
  message = "",
}) => (
  <div className={`notification ${type ? `notification--${type}` : ""}`}>
    <h5 className="notification--message">{message}</h5>
  </div>
);

export default Notification;
