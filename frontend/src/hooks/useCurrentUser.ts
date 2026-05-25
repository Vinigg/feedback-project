import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getProfile, type Profile } from '../services/profiles';

export function useCurrentUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase?.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      const sessionUser = data.session?.user;
      if (!sessionUser) {
        setLoading(false);
        return;
      }
      setUserId(sessionUser.id);
      getProfile(sessionUser.id)
        .then((p) => { if (isMounted) setProfile(p); })
        .catch(() => {})
        .finally(() => { if (isMounted) setLoading(false); });
    });

    return () => { isMounted = false; };
  }, []);

  return { userId, profile, loading };
}
