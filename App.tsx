import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CalendarDays, BedDouble, Users, Settings as SettingsIcon, LogOut, Menu, Loader2 } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Bookings } from './components/Bookings';
import { Rooms } from './components/Rooms';
import { Guests } from './components/Guests';
import { Assistant } from './components/Assistant';
import { Login } from './components/Login';
import { Settings } from './components/Settings';
import { SetupWizard } from './components/SetupWizard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { systemService } from './services/systemService';
import { MOCK_BOOKINGS, MOCK_GUESTS, MOCK_ROOMS } from './constants';
import { View, Room } from './types';

// Main App Layout that requires Authentication
const AuthorizedApp: React.FC = () => {
  const { signOut, user } = useAuth();
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDemo, setIsDemo] = useState(systemService.isDemoMode());

  // Data State
  const [data, setData] = useState<{
      bookings: any[], 
      guests: any[], 
      rooms: Room[]
  }>({
      bookings: [],
      guests: [],
      rooms: []
  });

  useEffect(() => {
      // Load Data based on mode
      if (isDemo) {
          setData({
              bookings: MOCK_BOOKINGS,
              guests: MOCK_GUESTS,
              rooms: MOCK_ROOMS
          });
      } else {
          // Load Real Data
          setData({
              bookings: [], // Placeholder for real bookings
              guests: [],   // Placeholder for real guests
              rooms: systemService.getRealRooms()
          });
      }
  }, [isDemo]);

  // Handlers for Room Management
  const handleAddRoom = (newRoom: Room) => {
      if (isDemo) {
          alert("Cannot modify rooms in Demo Mode.");
          return;
      }
      const updatedRooms = [...data.rooms, newRoom];
      setData(prev => ({ ...prev, rooms: updatedRooms }));
      systemService.saveRealRooms(updatedRooms);
  };

  const handleRemoveRoom = (roomId: string) => {
      if (isDemo) {
          alert("Cannot modify rooms in Demo Mode.");
          return;
      }
      const updatedRooms = data.rooms.filter(r => r.id !== roomId);
      setData(prev => ({ ...prev, rooms: updatedRooms }));
      systemService.saveRealRooms(updatedRooms);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.BOOKINGS:
        return <Bookings bookings={data.bookings} guests={data.guests} rooms={data.rooms} />;
      case View.ROOMS:
        return <Rooms 
            rooms={data.rooms} 
            user={user} 
            onAddRoom={handleAddRoom} 
            onRemoveRoom={handleRemoveRoom} 
        />;
      case View.GUESTS:
        return <Guests guests={data.guests} />;
      case View.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === view 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 hidden md:flex flex-col transition-all duration-300 fixed h-full z-10`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          {isSidebarOpen && <span className="text-xl font-bold text-slate-900 tracking-tight">StaySync</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label={isSidebarOpen ? "Dashboard" : ""} />
          <NavItem view={View.BOOKINGS} icon={CalendarDays} label={isSidebarOpen ? "Bookings" : ""} />
          <NavItem view={View.ROOMS} icon={BedDouble} label={isSidebarOpen ? "Rooms" : ""} />
          <NavItem view={View.GUESTS} icon={Users} label={isSidebarOpen ? "Guests" : ""} />
          <div className="pt-4 mt-4 border-t border-slate-100">
            <NavItem view={View.SETTINGS} icon={SettingsIcon} label={isSidebarOpen ? "Settings" : ""} />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          {isSidebarOpen && user?.role && (
             <div className="mb-4 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                 <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Role</p>
                 <p className="text-sm font-medium text-indigo-600">{user.role}</p>
             </div>
          )}
          <button 
            onClick={signOut}
            className="flex items-center gap-3 text-slate-500 hover:text-red-600 transition-colors w-full px-4 py-2"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="font-bold text-slate-900">StaySync</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
        </header>

        {/* Mobile Nav Overlay */}
        {!isSidebarOpen && (
           <div className="md:hidden fixed inset-0 bg-slate-900/50 z-30" onClick={() => setIsSidebarOpen(true)}>
             <div className="w-64 bg-white h-full p-4" onClick={e => e.stopPropagation()}>
                <nav className="space-y-2 mt-8">
                  <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
                  <NavItem view={View.BOOKINGS} icon={CalendarDays} label="Bookings" />
                  <NavItem view={View.ROOMS} icon={BedDouble} label="Rooms" />
                  <NavItem view={View.GUESTS} icon={Users} label="Guests" />
                </nav>
             </div>
           </div>
        )}

        {/* View Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
      
      {/* AI Assistant FAB */}
      <Assistant />
    </div>
  );
};

// Root Component wrapper handling Auth state & Setup State
const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    // Check if we need to run setup (only if not in Demo Mode and Setup isn't complete)
    if (!systemService.isDemoMode() && !systemService.isSetupComplete()) {
        setNeedsSetup(true);
    } else {
        setNeedsSetup(false);
    }
  }, [user]); // Re-check on auth change

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  // If we need setup, show wizard regardless of auth (wizard handles its own auth flow or bypass)
  if (needsSetup) {
      return <SetupWizard onComplete={() => setNeedsSetup(false)} />;
  }

  return user ? <AuthorizedApp /> : <Login />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;