import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../../components/shared/LoadingScreen";
import { ajaxRequest } from "../../utils/utils";

const InvitePage = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState("");

  useEffect(() => {
    ajaxRequest(`/api/${props.location.pathname}`, "POST", {
      data: { inviteKey: props.match.params.key },
    })
      .then((res) => {
        setLink(res.data.link);
        setLoading(false);
      })
      .catch((err) => {
        setLink(err.response && err.response.status === 401 ? "/signin" : "/");
        setLoading(false);
      });
  }, []);

  if (!loading) return <Navigate to={link} />;

  return (
    <main className="page-main">
      <LoadingScreen />
    </main>
  );
};

// InvitePage.propTypes = {
//   location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
//   match: PropTypes.shape({ params: PropTypes.shape({ key: PropTypes.string }) })
//     .isRequired,
// };

export default InvitePage;
