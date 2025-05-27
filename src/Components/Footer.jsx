import React from 'react';

export const Footer = () => {
  const year = new Date().getFullYear(); 

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {year} Real TakerCup. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};
