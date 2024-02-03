import React from 'react';
import { Link } from 'react-router-dom';

const NavItem = ({ to, onClick, children }) => {
    const linkProps = to
        ? { to, className: 'nav-link active' }
        : { href: '#', className: 'nav-link active', onClick };

    return (
        <li className="nav-item">
            {to ? <Link {...linkProps}>{children}</Link> : <a {...linkProps}>{children}</a>}
        </li>
    );
};

export default NavItem;
