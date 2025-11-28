import React from 'react';

export default function NavItem({ label, to, onClick, active, extraClass, navRef }) {
  return (
    <a
      href={to}
      onClick={onClick}
      className={
        'navitem' +
        (active ? ' navitem-active' : '') +
        (extraClass ? ' ' + extraClass : '')
      }
      ref={navRef}
    >
      {label}
    </a>
  );
}
