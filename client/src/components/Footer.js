import React from 'react';
import '../styles/navbar_footer.css';


const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <p>
          © {new Date().getFullYear()} Fit & Meet. All rights reserved.
        </p>
        <p>
          <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;