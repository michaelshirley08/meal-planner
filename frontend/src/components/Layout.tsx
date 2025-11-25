import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Layout.css';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/">Meal Planner</Link>
        </div>
        <div className="navbar-menu">
          <Link to="/recipes" className="navbar-item">Recipes</Link>
          <Link to="/meal-plan" className="navbar-item">Meal Plan</Link>
          <Link to="/shopping-list" className="navbar-item">Shopping List</Link>
          <Link to="/ingredients" className="navbar-item">Ingredients</Link>
        </div>
        <div className="navbar-user">
          <span className="user-name">{user?.username}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
