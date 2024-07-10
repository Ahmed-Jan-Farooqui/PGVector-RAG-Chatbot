import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";
import "./SignUp.css";

export default function SignUp() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Created user successfully!");
      console.log(auth.currentUser?.uid);
      navigate("/home");
      return;
    } catch (error) {
      alert(`Some error occurred during sign up which was ${error}`);
    }
  };

  return (
    <div className="signup-container">
      <input
        className="email-input"
        type="email"
        placeholder="Enter your email"
        onChange={(e) => {
          e.preventDefault();
          setEmail(e.target.value);
        }}
      />
      <input
        className="password-input"
        type="password"
        placeholder="Enter your password"
        onChange={(e) => {
          e.preventDefault();
          setPassword(e.target.value);
        }}
      />
      <input
        className="password-input"
        type="password"
        placeholder="Enter your password"
        onChange={(e) => {
          e.preventDefault();
          setConfirmPassword(e.target.value);
        }}
      />
      <button className="submit-btn" onClick={handleSubmit}>
        Sign Up
      </button>
      <div>
        Already have an account?{" "}
        <a
          className="login-txt"
          onClick={() => {
            navigate("/login");
          }}
        >
          Log In
        </a>
      </div>
    </div>
  );
}
