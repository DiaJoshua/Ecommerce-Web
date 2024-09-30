import React, { useState } from 'react';
import { sellerSignup, sellerLogin } from '../../services/api';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './SLoginSignup.css'; // Import your CSS file

const SLoginSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    idPicture: null,  // New field for ID picture
  });
  const [passwordError, setPasswordError] = useState('');
  const [isLogin, setIsLogin] = useState(false); // To toggle between login and sign up
  const navigate = useNavigate();

     // New state variable to handle password visibility
     const [showPassword, setShowPassword] = useState(false);

     const togglePasswordVisibility = () => {
      console.log("Toggling password visibility");
      setShowPassword((prev) => !prev);
    };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'idPicture') {
      setFormData({ ...formData, idPicture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };
  
  console.log(formData);  // Before sending the request

  const handleSignup = async (e) => {
    e.preventDefault();
  
    const { name, email, password, idPicture } = formData;
  
    if (!name || !email || !password || !idPicture) {
      toast.error("Please fill out all fields.");
      return;
    }
  
    const signupData = new FormData();
    signupData.append('name', name);
    signupData.append('email', email);
    signupData.append('password', password);
    signupData.append('idPicture', idPicture);
  
    try {
      const result = await sellerSignup(signupData);
      toast.success('Sign up successful! Waiting for admin approval.');
      navigate('/login');
    } catch (error) {
      console.error('Sign up error:', error.response); // More detailed logging
      toast.error(error.response?.data?.errors || 'Sign up failed. Please try again.');
    }
  };
  
  

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
  
    const loginData = {
      email: formData.email,
      password: formData.password,
    };
  
    try {
      const responseData = await sellerLogin(loginData); // Axios call
      console.log('Response Data:', responseData);
  
      if (!responseData.data.success) {
        toast.error(responseData.data.message || 'Login failed. Please try again.');
        return;
      }
  
      // Extract seller from the response
      const seller = responseData.data.seller;
  
      if (!seller) {
        toast.error('Seller account not found.');
        return;
      }
  
      // Check if the seller is approved
      if (!seller.isApproved) {
        toast.error('Your account is pending approval from the admin.');
        return;
      }
  
      // Proceed if seller is approved
      localStorage.setItem('admin_token', responseData.data.token); // Store token
      toast.success('Login successful! Redirecting to the dashboard...');
      navigate('/seller/addproduct');
      window.location.reload(); // Optional: Reload if necessary
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };
  
  


  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      setPasswordError('Password must be at least 8 characters long and include at least one capital letter.');
      return;
    } else {
      setPasswordError('');
    }

    try {
      const responseData = await sellerLogin(formData);
      localStorage.setItem('admin_token', responseData.token);
      navigate('/seller/addproduct');
      window.location.reload();
    } catch (error) {
      console.error('Frontend Error:', error);
      toast.error(error.response?.data?.errors || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{isLogin ? 'Seller Login' : 'Sign up as Seller'}</h1>

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
            <div className="password-container" style={{ position: 'relative' }}>
              <label>Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                    className="eye-icon"
                    onClick={togglePasswordVisibility}
                    style={{
                        cursor: 'pointer',
                        position: 'absolute',
                        right: '10px',
                        top: '60%',
                        transform: 'translateY(-50%)',
                    }}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Toggle eye icon */}
                </span>
            </div>
              {passwordError && <p className="password-error">{passwordError}</p>}
            </div>
            <button type="submit">Login</button>
            <p>Not registered? <span className="link" onClick={() => setIsLogin(false)}>Sign up as a <b>Seller</b></span></p>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
            <div className="password-container" style={{ position: 'relative' }}>
              <label>Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
                          <span
                    className="eye-icon"
                    onClick={togglePasswordVisibility}
                    style={{
                        cursor: 'pointer',
                        position: 'absolute',
                        right: '10px',
                        top: '60%',
                        transform: 'translateY(-50%)',
                    }}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Toggle eye icon */}
                </span>
            </div>
              {passwordError && <p className="password-error">{passwordError}</p>}
            </div>
            <div>
              <label>Upload ID (For Verification):</label>
              <input
                type="file"
                name="idPicture"
                accept="image/*"
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Sign up</button>
            <p>Already a seller? <span className="link" onClick={() => setIsLogin(true)}>Click here to <b>Login</b></span></p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SLoginSignup;
