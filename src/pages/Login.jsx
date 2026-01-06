import { useContext } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./Login.css";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { user, logout } = useContext(AuthContext);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setError("No account found. Please create an account.");
      return;
    }

    if (user.email === email && user.password === password) {
      login(user); 
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
  };

  const handleLogout = () => {
  logout();
  navigate("/login");
};


  return (
    <section className="auth-wrapper">
      <div className="auth-glow" />

      <div className="auth-card" data-aos="zoom-in">
        <h2>Welcome Back</h2>
        <p className="subtitle">
          Login to continue shopping with <strong>UrbanSole</strong>
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <input
              type="email"
              required
              placeholder=" "
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
            <label>Email address</label>
          </div>


          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder=" "
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
            <label>Password</label>

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>


          <div className="auth-options">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button className="auth-btn">Login</button>
        </form>

        <div className="auth-footer">
          Don’t have an account?
          <Link to="/register"> Create Account</Link>
        </div>
      </div>
    </section>
  );
}

export default Login;
