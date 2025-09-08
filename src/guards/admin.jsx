'use client';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';
import { toast } from 'react-hot-toast';

// redux
import { useSelector } from 'src/redux';

// components
import Loading from 'src/components/loading';
import { checkIsAdmin } from 'src/utils/checkAdmin';

export default function Guest({ children }) {
  const router = useRouter();
  const [isAdmin, setAdmin] = useState(true);
  const { isAuthenticated, user } = useSelector(({ user }) => user);

  useEffect(() => {
    if (!isAuthenticated || !checkIsAdmin(user?.role)) {
      setAdmin(false);
      toast.error("You're not allowed to access dashboard");
      router.push('/auth/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAdmin) {
    return <Loading />;
  }
  return children;
}

Guest.propTypes = {
  children: PropTypes.node.isRequired
};
