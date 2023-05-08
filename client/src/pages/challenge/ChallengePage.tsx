import * as React from "react";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import LoadingScreen from "../../components/shared/LoadingScreen";
import Challenge from "./Challenge";
import {
  getChallenge,
  setCode,
  convertRoomToPublic,
  testCode,
  clearData,
  saveCode,
} from "../../actions/challenge";
import {
  setMessage,
  sendMessage,
  toggleChatVisibility,
  resetChatData,
  messageIndicator,
} from "../../actions/chat";
import { openSocket, closeSocket } from "../../actions/socket";
import "./styles/challenge.css";

const ChallengeErrorPage: FC<{ message: string }> = ({ message }) => (
  <section className="challenge challenge--error">
    <p className="challenge__error-msg">{message}</p>
  </section>
);

const ChallengePage = (props: any) => {
  const { rId, cId } = useParams();
  // Clean up
  React.useEffect(() => {
    return () => {
      props.clearData();
      props.resetChatData();
      props.closeSocket();
    };
  }, []);

  // Fetch data for challenge/room initial mount
  React.useEffect(() => {
    props.getChallenge(cId, rId);
  }, [props.getChallenge, rId, cId]);

  // Open socket and connect to room
  React.useEffect(() => {
    if (!props.socket.connected) {
      props.openSocket();
    } else if (props.socket.ready && !props.socket.inRoom) {
      props.joinRoom(rId, props.username);
    }
  }, [
    props.socket.connected,
    props.socket.inRoom,
    props.socket.ready,
    props.challenge.private,
  ]);

  const { challenge, chat, socket } = props;

  // If an error occurred during data fetch
  if (challenge.challengeError) {
    return <ChallengeErrorPage message={challenge.challengeError} />;
  }

  // Show loading screen if challenge or room data is being fetched
  if (!challenge.id) {
    return <LoadingScreen message="Getting data" />;
  }

  // Display loading message until chat is connected in public room
  if (!challenge.private && (!socket.connected || !socket.inRoom)) {
    return <LoadingScreen message="Connecting to room" />;
  }

  return (
    <Challenge
      privateRoom={challenge.private}
      title={challenge.title}
      prompt={challenge.prompt}
      code={challenge.code}
      testing={challenge.testing}
      language={challenge.language}
      testPassed={challenge.testPassed}
      testResults={challenge.testResults}
      testErrors={challenge.testErrors}
      inviteLink={challenge.inviteLink}
      savingCode={challenge.savingCode}
      messages={chat.messages}
      chatInput={chat.chatInput}
      chatVisible={chat.visible}
      usersTyping={chat.usersTyping}
      userId={props.userId}
      toggleChatVisibility={props.toggleChatVisibility}
      setMessage={props.setMessage}
      messageIndicator={(typing) =>
        props.messageIndicator(rId, props.username, typing)
      }
      sendMessage={(msg) => props.sendMessage(rId, msg, props.userId)}
      setCode={(code) => props.setCode(rId, code)}
      saveCode={() => props.saveCode(rId, challenge.code)}
      convertRoomToPublic={() => props.convertRoomToPublic(rId)}
      testCode={(code) =>
        props.testCode(cId, rId, code, props.challenge.language)
      }
    />
  );
};

const mapStateToProps = (state: any) => ({
  userId: state.user.id,
  username: state.user.username,
  socket: state.socket,
  challenge: state.challenge,
  chat: state.chat,
});

const mapDispatchToProps = (dispatch: any) => ({
  getChallenge: (cId: string, rId: string) => dispatch(getChallenge(cId, rId)),
  openSocket: () => dispatch(openSocket()),
  closeSocket: () => dispatch(closeSocket()),
  messageIndicator: (roomId: string, username: string, typing: boolean) =>
    dispatch(messageIndicator(roomId, username, typing)),
  joinRoom: (id: string, username: string) =>
    dispatch({ type: "join_room", payload: { room: id, username } }),
  setMessage: (text: string) => dispatch(setMessage(text)),
  sendMessage: (room: string, msg: string, userId: string) =>
    dispatch(sendMessage(room, msg, userId)),
  toggleChatVisibility: () => dispatch(toggleChatVisibility()),
  setCode: (room: string, code: string) => dispatch(setCode(room, code)),
  convertRoomToPublic: (rId: string) => dispatch(convertRoomToPublic(rId)),
  testCode: (cId: string, rId: string, code: string, language: string) =>
    dispatch(testCode(cId, rId, code, language)),
  clearData: () => dispatch(clearData()),
  resetChatData: () => dispatch(resetChatData()),
  saveCode: (roomId: string, code: string) => dispatch(saveCode(roomId, code)),
});

ChallengePage.propTypes = {
  messageIndicator: PropTypes.func.isRequired,
  clearData: PropTypes.func.isRequired,
  resetChatData: PropTypes.func.isRequired,
  closeSocket: PropTypes.func.isRequired,
  getChallenge: PropTypes.func.isRequired,
  toggleChatVisibility: PropTypes.func.isRequired,
  saveCode: PropTypes.func.isRequired,
  testCode: PropTypes.func.isRequired,
  convertRoomToPublic: PropTypes.func.isRequired,
  setCode: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  openSocket: PropTypes.func.isRequired,
  joinRoom: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  socket: PropTypes.shape({
    connected: PropTypes.bool,
    ready: PropTypes.bool,
    inRoom: PropTypes.bool,
  }).isRequired,
  challenge: PropTypes.shape({
    private: PropTypes.bool,
    id: PropTypes.string,
    challengeError: PropTypes.string,
    code: PropTypes.string,
    title: PropTypes.string,
    prompt: PropTypes.string,
    testing: PropTypes.bool,
    language: PropTypes.string,
    testPassed: PropTypes.bool,
    testResults: PropTypes.array,
    testErrors: PropTypes.string,
    inviteLink: PropTypes.string,
    savingCode: PropTypes.bool,
  }).isRequired,
  chat: PropTypes.shape({
    messages: PropTypes.array,
    chatInput: PropTypes.string,
    visible: PropTypes.bool,
    usersTyping: PropTypes.array,
  }).isRequired,
};

ChallengeErrorPage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChallengePage);
