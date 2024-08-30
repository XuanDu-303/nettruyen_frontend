import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../services/authService";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      const result = await logout();
      if (result.status === 200) {
        navigate('/login');
      }
    };

    handleLogout();
  }, [navigate]);

  return <>Logout ...</>;
};

export default Logout;