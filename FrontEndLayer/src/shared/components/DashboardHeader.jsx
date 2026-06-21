import { useAuth } from '../../hooks/useAuth';

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 24px',
  backgroundColor: '#1976d2',
  color: '#fff',
};

const DashboardHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header style={headerStyle}>
      <h2 style={{ margin: 0 }}>Morshed University</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span>{user?.email || 'User'}</span>
        <button
          onClick={logout}
          style={{
            padding: '6px 16px',
            backgroundColor: '#fff',
            color: '#1976d2',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
