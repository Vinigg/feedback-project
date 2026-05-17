import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export type ProfileRole = 'admin' | 'technical-leader' | 'behavioral-leader' | 'employee';

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: ProfileRole[];
}

const roleRedirects: Record<ProfileRole, string> = {
  admin: '/admin',
  'technical-leader': '/technical-leader',
  'behavioral-leader': '/behavioral-leader',
  employee: '/employee',
};

const isProfileRole = (role: string): role is ProfileRole => {
  return role in roleRedirects;
};

export const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      if (!isSupabaseConfigured || !supabase) {
        if (isMounted) {
          setRedirectTo('/');
          setIsAuthorized(false);
          setIsLoading(false);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (!data.session) {
        setRedirectTo('/');
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      if (!allowedRoles?.length) {
        setRedirectTo(null);
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.session.user.id)
        .single<{ role: string }>();

      if (!isMounted) return;

      if (!profile || !isProfileRole(profile.role)) {
        setRedirectTo('/');
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      if (!allowedRoles.includes(profile.role)) {
        setRedirectTo(roleRedirects[profile.role]);
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      setRedirectTo(null);
      setIsAuthorized(true);
      setIsLoading(false);
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [allowedRoles]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to={redirectTo ?? '/'} replace />;
  }

  return <>{children}</>;
};
