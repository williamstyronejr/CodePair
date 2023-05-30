import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import LoadingScreen from '../../components/shared/LoadingScreen';
import { ajaxRequest } from '../../utils/utils';

const InvitePage = () => {
  const { key } = useParams();
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState('');

  useEffect(() => {
    ajaxRequest(`/api/invite/${key}`, 'POST', {
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
  }, [key]);

  if (!loading && link !== '') return <Navigate to={link} />;

  return (
    <main className="page-main">
      <LoadingScreen />
    </main>
  );
};

export default InvitePage;
