import * as React from 'react';
import { Link } from 'react-router-dom';
import './styles/notFoundPage.css';

const NotFoundPage = () => (
  <main className="page-main">
    <section className="missing">
      <h2>404 - Page Not Found</h2>
      <p>This page does not exists or has been moved.</p>
      <Link to="/" className="missing__link">
        Go Back Home
      </Link>
    </section>
  </main>
);

export default NotFoundPage;
