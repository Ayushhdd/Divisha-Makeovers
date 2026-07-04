import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Navbar({ user, onLogout }) {
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-softpink-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <span className="hidden sm:block text-sm text-gray-600">
                Hi, {user.fullName?.split(' ')[0]}
              </span>
              <button onClick={onLogout} className="btn-outline text-sm py-2 px-3">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/divisha/login" className="btn-outline text-sm py-2 px-3">Login</Link>
              <Link to="/divisha/register" className="btn-primary text-sm py-2 px-3">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
