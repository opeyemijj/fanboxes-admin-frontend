'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLogout } from 'src/redux/slices/user';
import { resetWishlist } from 'src/redux/slices/wishlist';
import { deleteCookies } from 'src/hooks/cookies';
import { useRouter } from 'next/navigation';

export default function SessionPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Perform logout actions
    deleteCookies('token');
    dispatch(setLogout());
    dispatch(resetWishlist());
    
    // Redirect after state updates are complete
    router.push('/auth/login');
  }, [dispatch, router]);

  return null; // Or a loading spinner if needed
}