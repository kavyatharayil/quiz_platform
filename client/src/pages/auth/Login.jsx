import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth.api";
 
function Login() {
  const navigate = useNavigate();
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("user");


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();


    try {
      const data = await authApi.login(email, password);
      const { user } = data;
      
      // With cookies, token and isLoggedIn are handled by the backend headers
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          name: user.name,
          email: user.email,
          role: user.role || 'USER',
        })
      );
   
      const userRole = (user.role || 'USER').toUpperCase();
      if (userRole === 'SUPER_ADMIN' || userRole === 'SUPERADMIN') {
        navigate("/superadmin");
      } else if (userRole === 'ADMIN') {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("API Login failed:", err);
      setError(err?.response?.data?.message || "Invalid email or password");
    }
  };
 
  return (
    <div className="auth-page">
      <div className="auth-card login-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="brand-mark">Q</div>
          <span>Quiz Platform</span>
        </div>
 
        {/* Heading */}
        <div className="auth-heading">
          <h1>Welcome back</h1>
          <p>Sign in to continue your quiz journey.</p>
        </div>
 
        {error && <div className="error">{error}</div>}

         {/* Role */}
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>

 
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email (e.g. superadmin@example.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
 
          {/* Password */}
          <div className="form-group">
            <div className="password-label-row">
              <label htmlFor="login-password">Password</label>
            </div>
 
            <div className="password-wrapper">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
 
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
 
          {/* Login */}
          <button type="submit" className="auth-submit">
            Sign In
          </button>
        </form>


        {/* Register */}
        <p className="auth-footer mt-4">
          Don't have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;