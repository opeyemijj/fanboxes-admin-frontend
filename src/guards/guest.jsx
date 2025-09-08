'use client';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';
import { useSelector } from 'src/redux';

// components
import Loading from 'src/components/loading';
import { checkIsAdmin } from 'src/utils/checkAdmin';

Guest.propTypes = {
  children: PropTypes.node.isRequired
};
export default function Guest({ children }) {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(({ user }) => user);
  const [isAuth, setAuth] = useState(true);
  useEffect(() => {
    if (isAuthenticated) {
      setAuth(false);

      const isAdmin = checkIsAdmin(user.role); // user.role.includes('admin');
      const isVendor = checkIsAdmin(user.role); // user.role.includes('vendor');
      router.push(isAdmin ? '/admin/dashboard' : isVendor ? '/vendor/dashboard' : '/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!isAuth) {
    return <Loading />;
  }
  return children;
}
