export function checkIsAdmin(user) {
  if (user?.role?.toLowerCase() != 'user' || user?.role?.toLowerCase() != 'influencer') {
    return true;
  } else {
    return false;
  }
}
