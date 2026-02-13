import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-dark-950 noise-bg flex relative overflow-hidden">
      {/* Background orbs — larger for widescreen */}
      <div className="orb-purple-xl top-[-200px] left-[200px] fixed" />
      <div className="orb-orange-xl bottom-[-150px] right-[100px] fixed" />
      <div className="orb-purple top-[40%] right-[-100px] fixed opacity-50" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area — offset by sidebar width */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 relative z-10 px-8 py-6 max-w-[1400px] w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
