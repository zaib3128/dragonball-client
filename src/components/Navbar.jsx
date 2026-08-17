import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import sideLogo from '../assets/side_logo.jpg';
import mainLogo from '../assets/logo.png';

const Navbar = () => {
  // This function automatically applies the black background ONLY to the active page
  const navLinkStyles = ({ isActive }) =>
    `px-5 py-3 transition-colors ${
      isActive 
        ? 'bg-black text-white' // Applied when on this page
        : 'text-black hover:bg-black hover:text-white' // Applied when on other pages
    }`;

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#F4F1EA] sticky top-0 z-50 border-b-[3px] border-black">
      
      {/* Wrapped logos in a Link so clicking them takes you home */}
      <Link to="/" className="flex items-center gap-4">
        <img src={sideLogo} alt="Dragon Ball" className="w-10 h-10 rounded-full border-2 border-black" />
        <img src={mainLogo} alt="DBZ Logo" className="h-10 object-contain" />
      </Link>
      
      <nav className="flex font-bold text-xs tracking-widest uppercase">
        <NavLink to="/" className={navLinkStyles}>
          HOME
        </NavLink>
        <NavLink to="/characters" className={navLinkStyles}>
          CHARACTERS
        </NavLink>
        <NavLink to="/journey" className={navLinkStyles}>
          JOURNEY
        </NavLink>
        <NavLink to="/watch" className={navLinkStyles}>
          WATCH
        </NavLink>
      </nav>

    </header>
  );
};

export default Navbar;