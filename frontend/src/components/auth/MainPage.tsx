import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import Dashboard from '../dashboard/Dashboard';
import RescuedPetsPage from '../pages/RescuedPetsPage';
import ProfilePage from '../pages/ProfilePage';
import { apiService } from '../../services/api';
import LostPetsPage from '../pages/LostPetsPage';

interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  pincode?: string;
  gender?: string;
  profile_image?: string;
}

const MainPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ✅ State for mobile sidebar
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    apiService.logout();
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await apiService.getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [handleLogout]);

  // ✅ New handler to close sidebar on navigation
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'rescued-pets':
        return <RescuedPetsPage />;
      case 'profile':
        return <ProfilePage onLogout={handleLogout} />;
      case 'lost-pets': 
        return <LostPetsPage />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} // ✅ Pass toggle function
      />
      
      {/* Main Layout */}
      <div className="flex">
        {/* ✅ Sidebar Wrapper: Handles responsive positioning and transitions */}
        <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}>
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={handleSectionChange} 
          />
        </div>
        
        {/* ✅ Overlay: Dims content when sidebar is open on mobile */}
        {isSidebarOpen && (
            <div 
                onClick={() => setIsSidebarOpen(false)} 
                className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            ></div>
        )}
        
        {/* ✅ Main Content: Has a responsive left margin */}
        <div className="flex-1 lg:ml-64 mt-16 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MainPage;