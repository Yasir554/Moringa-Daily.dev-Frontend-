import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';

  return (
    <footer
      className="text-white py-10 px-4 mt-12 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/Footer.png')" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left: Logo + Socials + Link */}
        <div className="space-y-4">
          <img src="/moringa-blue-and-white.png" alt="Moringa Logo" className="h-10" />
          <div className="flex items-center space-x-4 mt-4">
            <a
              href="https://web.facebook.com/moringaschool/?_rdc=1&_rdr#"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#0c1a3c] rounded-full p-1.5 hover:scale-105 transition"
            >
              <FaFacebookF size={16} />
            </a>
            <a
              href="https://www.linkedin.com/school/moringa-school/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#0c1a3c] rounded-full p-1.5 hover:scale-105 transition"
            >
              <FaLinkedinIn size={16} />
            </a>
            <a
              href="https://x.com/moringaschool"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#FA570F] transition"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://www.youtube.com/MoringaSchoolVideos/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#0c1a3c] rounded-full p-1.5 hover:scale-105 transition"
            >
              <FaYoutube size={16} />
            </a>
          </div>

          <hr className="border-gray-400 w-2/3" />
          <Link
            to={isAboutPage ? '/' : '/about'}
            className="text-white font-semibold text-sm hover:text-[#FA570F] transition-colors"
          >
            {isAboutPage ? 'Home' : 'About'}
          </Link>
        </div>

        {/* Center: Contact Info */}
        <div className="pt-12 text-sm space-y-2 leading-6">
          {[
            'Ngong Lane, Ngong Lane Plaza, 1st Floor, Nairobi Kenya',
            '📞 +254711 082 146 (General Enquiries)',
            '📱 +254712 293 878 (Whatsapp)',
            '📞 0738 368 319 (Corporate Inquiries)',
            '✉️ contact@moringaschool.com',
            '✉️ admissions@moringaschool.com',
            '✉️ corporate@moringaschool.com',
            '📮 P.O Box 28860 - 00100, Nairobi',
          ].map((text, i) => (
            <p key={i} className="cursor-pointer hover:underline">{text}</p>
          ))}
        </div>

        {/* Right: Responsive Google Map */}
        <div className="pt-12">
          <div className="relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7906100421255!2d36.782031775901935!3d-1.3004861986871605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1a6bf7445dc1%3A0x940b62a3c8efde4c!2sMoringa%20School!5e0!3m2!1sen!2ske!4v1745778184212!5m2!1sen!2ske"
              title="Moringa School Map"
              className="absolute top-0 left-0 w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs text-gray-300 mt-10 cursor-pointer">
        © {new Date().getFullYear()} Moringa School. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
