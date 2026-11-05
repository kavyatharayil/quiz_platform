import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth.api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  // Password conditions
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const passwordValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial;

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!passwordValid) {
      setError("Please meet all password requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // NOTE: backend register expects name, email, password (role might not be supported by backend directly during register without admin privileges, but we pass it anyway if supported)
      const data = await authApi.register(name, email, password, role);
      console.log("Registered user:", data);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        {/* Header */}
        <div className="auth-brand">
          <div className="brand-mark">Q</div>
          <span>Quiz Platform</span>
        </div>

        <div className="auth-heading">
          <h1>Create your account</h1>
          <p>Join Quiz Platform and start testing your knowledge.</p>
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
            </select>
          </div>


        <form onSubmit={handleRegister}>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
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

          {/* Password Requirements */}
          <div className="password-requirements">
            <p>Password must contain:</p>
            <div className={hasMinLength ? "requirement valid" : "requirement"}>
              <span>{hasMinLength ? "✓" : "✕"}</span>
              At least 8 characters
            </div>
            <div className={hasUppercase ? "requirement valid" : "requirement"}>
              <span>{hasUppercase ? "✓" : "✕"}</span>
              One uppercase letter
            </div>
            <div className={hasLowercase ? "requirement valid" : "requirement"}>
              <span>{hasLowercase ? "✓" : "✕"}</span>
              One lowercase letter
            </div>
            <div className={hasNumber ? "requirement valid" : "requirement"}>
              <span>{hasNumber ? "✓" : "✕"}</span>
              One number
            </div>
            <div className={hasSpecial ? "requirement valid" : "requirement"}>
              <span>{hasSpecial ? "✓" : "✕"}</span>
              One special character
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

         
          {/* Register Button */}
          <button type="submit" className="auth-submit">
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;