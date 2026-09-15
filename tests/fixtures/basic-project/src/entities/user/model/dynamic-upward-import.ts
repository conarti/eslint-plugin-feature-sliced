/* Violation: layers-slices "can-not-import" reported on a dynamic import expression */
export async function loadLogin() {
  const { loginUser } = await import('src/features/auth');
  return loginUser;
}
