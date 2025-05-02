import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';

  return (
    <footer className="bg-[url('/Footer.png')]">
      <div className=" pt-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left: Logo + Socials + Link */}
        <div className="gg-white space-y-4">
          <img src="/moringa.png" alt="Moringa Logo" className="h-10" />
          <div className="flex items-center space-x-4 text-xl">
            <a href="https://facebook.com" aria-label="Facebook">🌐</a>
            <a href="https://linkedin.com" aria-label="LinkedIn">🔗</a>
            <a href="https://twitter.com" aria-label="Twitter">🐦</a>
            <a href="https://youtube.com" aria-label="YouTube">▶️</a>
          </div>
          <hr className="border-gray-400 w-2/3" />
          <Link
            to={isAboutPage ? '/' : '/about'}
            className="text-white font-semibold text-sm hover:underline"
          >
            {isAboutPage ? 'Home' : 'About'}
          </Link>
        </div>

        {/* Center: Contact Info */}
        <div className=" text-white pt-12 text-sm space-y-2 leading-6">
          <p className="font-medium">
            Ngong Lane, Ngong Lane Plaza, 1st Floor, Nairobi Kenya
          </p>
          <p>📞 +254711 082 146 (General Enquiries)</p>
          <p>📱 +254712 293 878 (Whatsapp)</p>
          <p>📞 0738 368 319 (Corporate Inquiries)</p>
          <p>✉️ contact@moringaschool.com</p>
          <p>✉️ admissions@moringaschool.com</p>
          <p>✉️ corporate@moringaschool.com</p>
          <p>📮 P.O Box 28860 - 00100, Nairobi</p>
        </div>

        {/* Right: Google Map */}
        <div className='pt-12'>
          <iframe
            title="Moringa Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8346564992683!2d36.80082127496574!3d-1.2969285356380017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1126f12737a1%3A0x58c7b41ec45c1849!2sMoringa%20School!5e0!3m2!1sen!2ske!4v1683473930203!5m2!1sen!2ske"
            width="100%"
            height="200"
            className="rounded border-0 w-full"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs text-gray-300 mt-10">
        © 2025 Moringa School. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
