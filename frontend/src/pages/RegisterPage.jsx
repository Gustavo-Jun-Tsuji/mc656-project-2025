function RegisterPage() {
  // Clear auth tokens from local storage
  localStorage.removeItem(ACCESS_TOKEN_KEYNAME);
  localStorage.removeItem(REFRESH_TOKEN_KEYNAME);

  return (
    <div>
      <h1>Register Page</h1>
      <p>This is the register page.</p>
    </div>
  );
}

function logoutAndRegister() {
  localStorage.removeItem(ACCESS_TOKEN_KEYNAME);
  localStorage.removeItem(REFRESH_TOKEN_KEYNAME);

  return <RegisterPage />;
}

export default RegisterPage;
