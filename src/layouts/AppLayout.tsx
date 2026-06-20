import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const links = [
    ['Dashboard', '/dashboard'],
    ['Publishers', '/publishers'],
    ['Offers', '/offers'],
    ...(user?.role === 'admin' ? [['Users', '/users'], ['Reports', '/reports']] : []),
    ['Profile', '/profile']
  ];

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="bg-slate-950 p-5 text-white lg:min-h-screen lg:w-64">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-400">Publisher Ops</p>
          <h1 className="mt-1 text-xl font-bold">Control Center</h1>
        </div>
        <nav className="flex gap-2 overflow-x-auto lg:flex-col">
          {links.map(([label, path]) => (
            <NavLink key={path} to={path} className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-cyan-500 font-semibold text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`
            }>{label}</NavLink>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b bg-white px-5 py-4">
          <div>
            <p className="font-semibold text-slate-900">{user?.name}</p>
            <p className="text-xs capitalize text-slate-500">{user?.role}</p>
          </div>
          <button className="btn-secondary" onClick={logout}>Sign out</button>
        </header>
        <div className="mx-auto max-w-7xl p-5 lg:p-8"><Outlet /></div>
      </main>
    </div>
  );
}
