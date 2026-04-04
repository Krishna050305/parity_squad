import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  role: 'lender' | 'borrower' | 'any';
  children: React.ReactNode;
}

export const AuthGuard = ({ role, children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const storedRole = localStorage.getItem('lp_role');
  const address = localStorage.getItem('connectedAddress');
  
  useEffect(() => {
    if (!address || !storedRole) {
      navigate('/auth', { replace: true });
      return;
    }
    if (role !== 'any' && storedRole !== role) {
      navigate(storedRole === 'lender' ? '/lender/home' : '/borrower/dashboard', { replace: true });
    }
  }, [address, storedRole, role, navigate]);
  
  if (!address || !storedRole) return null;
  return <>{children}</>;
};
