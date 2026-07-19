import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { fetchNotifications } from '../store/adminSlice';
import Logo from '../components/Logo';
import api from '../api/axios';

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/appointments', label: 'Appointments' },
  { to: '/admin/calendar', label: 'Calendar' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const { unreadCount } = useSelector((state) => state.admin);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = useSelector((state) => state.admin.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
    const interval = setInterval(() => dispatch(fetchNotifications()), 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const markAllRead = async () => {
    await api.put('/admin/notifications/read-all');
    dispatch(fetchNotifications());
  };

  return (
    <div className="min-h-screen flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-softpink-200 transform transition-transform lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-softpink-100">
          <Logo size="sm" />
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
          <a
            href="/"
            className="mt-3 inline-flex items-center rounded-lg border border-softpink-200 px-3 py-2 text-sm font-medium text-rosegold-600 transition-colors hover:bg-softpink-50"
          >
            <span aria-hidden="true">← </span>
            Main Website
          </a>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-rosegold-50 text-rosegold-700' : 'text-gray-600 hover:bg-softpink-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/admin/change-password"
            className="block px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-softpink-50"
          >
            Change Password
          </NavLink>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-softpink-100">
          <button
            onClick={() => dispatch(logout())}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl"
          >
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-softpink-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-2xl">☰</button>
          <h1 className="font-display text-lg text-rosegold-700 hidden sm:block">Admin Dashboard</h1>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-softpink-50"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-lg border border-softpink-200 z-50">
                <div className="p-3 border-b flex justify-between items-center">
                  <span className="font-medium text-sm">Notifications</span>
                  <button onClick={markAllRead} className="text-xs text-rosegold-600">Mark all read</button>
                </div>
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500 text-center">No notifications</p>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div key={n._id} className={`p-3 border-b text-sm ${!n.isRead ? 'bg-softpink-50' : ''}`}>
                      <p className="font-medium">{n.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
