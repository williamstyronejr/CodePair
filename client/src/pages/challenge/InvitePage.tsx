import { useState, useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import LoadingScreen from '../../components/shared/LoadingScreen';
import { ajaxRequest } from '../../utils/utils';

const InvitePage = () => {
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState('');
  const { key } = useParams();
  const { pathname } = useLocation();

  useEffect(() => {
    ajaxRequest(`/api/${pathname}`, 'POST', {
      data: { inviteKey: key },
    })
      .then((res) => {
        setLink(res.data.link);
        setLoading(false);
      })
      .catch((err) => {
        setLink(err.response && err.response.status === 401 ? '/signin' : '/');
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

export default InvitePage;
