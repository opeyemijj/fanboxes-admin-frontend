export function checkIsAdmin(roleName) {
  const roleType = roleName?.toLowerCase();
  if (!['user', 'vendor', 'influencer', '', null, undefined].includes(roleType)) {
    return true;
  } else {
    return false;
  }
}
