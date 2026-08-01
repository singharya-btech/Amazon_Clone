import { Link } from 'react-router-dom'

const footerLinks = {
  'Get to Know Us': ['About Us', 'Careers', 'Press Releases', 'Amazon Science'],
  'Make Money with Us': ['Sell on Amazon', 'Sell Under Amazon', 'Associates Program', 'Advertise Your Products'],
  'Amazon Payment Products': ['Amazon Business Card', 'Shop with Points', 'Reload Your Balance', 'Amazon Currency Converter'],
  'Let Us Help You': ['Your Account', 'Your Orders', 'Shipping Rates', 'Returns & Replacements', 'Help'],
}

export default function Footer() {
  return (
    <footer className="bg-amazon-navy text-white mt-8">
      {/* Back to top */}
      <div
        className="bg-amazon-light text-center py-3 text-sm cursor-pointer hover:bg-gray-600 transition-colors"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to top
      </div>

      {/* Links */}
      <div className="max-w-[1500px] mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-sm mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link to="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-amazon-light py-6">
        <div className="max-w-[1500px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-white font-bold text-xl">amazon<span className="text-amazon">.clone</span></span>
            <span className="text-gray-400 text-xs mt-1">© 2024 Amazon Clone. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400 text-xs">
            <Link to="#" className="hover:text-white">Conditions of Use</Link>
            <Link to="#" className="hover:text-white">Privacy Notice</Link>
            <Link to="#" className="hover:text-white">Interest-Based Ads</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
