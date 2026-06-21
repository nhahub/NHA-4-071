import { Outlet } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import { useAuth } from '../../hooks/useAuth';

const layoutStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
};

const bodyStyle = {
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
};

const mainStyle = {
  flex: 1,
  padding: 24,
  overflowY: 'auto',
  backgroundColor: '#fafafa',
};

const DashboardLayout = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={layoutStyle}>
      <DashboardHeader />
      <div style={bodyStyle}>
        <DashboardSidebar />
        <main style={mainStyle}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
