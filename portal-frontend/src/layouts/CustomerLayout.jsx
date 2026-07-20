import { NavLink, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import Logo from '../components/Logo';

const navItems = [
  { to: '/divisha/dashboard', label: 'Home', icon: '🏠' },
  { to: '/divisha/book', label: 'Book', icon: '✨' },
  { to: '/divisha/appointments', label: 'Appointments', icon: '📅' },
  { to: '/divisha/payments', label: 'Payments', icon: '💳' },
  { to: '/divisha/profile', label: 'Profile', icon: '👤' },
];

export default function CustomerLayout() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex flex-col pb-20 sm:pb-0">
      <header className="bg-white border-b border-softpink-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-2 px-4 py-3">
          <Logo size="sm" />
          <div className="ml-auto flex shrink-0 items-center gap-2 max-[359px]:w-full max-[359px]:justify-end">
            <a
              href="/"
              className="shrink-0 whitespace-nowrap rounded-lg border border-softpink-200 px-2.5 py-1.5 text-sm font-medium text-rosegold-600 transition-colors hover:bg-softpink-50 sm:px-3"
            >
              <span aria-hidden="true">← </span>
              <span className="sm:hidden">Website</span>
              <span className="hidden sm:inline">Main Website</span>
            </a>
            <span className="text-sm text-gray-600 hidden sm:block">{user?.fullName}</span>
            <button onClick={() => dispatch(logout())} className="shrink-0 whitespace-nowrap text-sm text-rosegold-600 hover:underline">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-softpink-200 z-40">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center px-2 py-1 text-xs ${
                  isActive ? 'text-rosegold-600' : 'text-gray-500'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <nav className="hidden sm:block bg-white border-t border-softpink-200">
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-rosegold-500 text-rosegold-600'
                    : 'border-transparent text-gray-500 hover:text-rosegold-500'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
