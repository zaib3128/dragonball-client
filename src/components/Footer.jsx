import React from 'react';
import sideLogo from '../assets/side_logo.jpg';

const Footer = () => {
  return (
    <footer className="bg-[#F4F1EA] border-t-[3px] border-black text-black pt-12 pb-8 px-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        
        {/* Col 1: Brand Info */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={sideLogo} alt="Dragon Ball" className="w-8 h-8 rounded-full border-2 border-black" />
            <span className="font-black text-2xl uppercase tracking-tighter">Dragon Ball</span>
          </div>
          <p className="text-sm font-medium text-gray-700 leading-relaxed">
            An unofficial editorial fan archive documenting 40 years of Dragon Ball lore, character arcs, and battle sagas.
          </p>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h4 className="text-[#D32F2F] font-bold text-xs tracking-[0.2em] uppercase mb-4">Navigation</h4>
          <ul className="space-y-2 font-bold text-sm tracking-wide uppercase">
            <li><a href="/" className="hover:text-[#D32F2F] transition-colors">→ Home</a></li>
            <li><a href="/characters" className="hover:text-[#D32F2F] transition-colors">→ Characters</a></li>
            <li><a href="/journey" className="hover:text-[#D32F2F] transition-colors">→ Journey</a></li>
            <li><a href="/watch" className="hover:text-[#D32F2F] transition-colors">→ Watch Order</a></li>
          </ul>
        </div>

        {/* Col 3: Disclaimer */}
        <div>
          <h4 className="text-[#D32F2F] font-bold text-xs tracking-[0.2em] uppercase mb-4">Archive Note</h4>
          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            Dragon Ball, Dragon Ball Z, and all associated characters are trademarks of Bird Studio / Shueisha and Toei Animation.
          </p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t-2 border-black border-dashed pt-6 max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-bold tracking-widest text-gray-600 uppercase">
        <p>© 2026 SEVEN ORBS ARCHIVE. ALL RIGHTS RESERVED.</p>
        <p className="mt-2 sm:mt-0">BUILT WITH MERN STACK</p>
      </div>
    </footer>
  );
};

export default Footer;