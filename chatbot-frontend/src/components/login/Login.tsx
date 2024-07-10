import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      alert(`Error occurred during login which was ${error}`);
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
      <button className="submit-btn" onClick={handleSubmit}>
        Log In
      </button>
      <div>
        Already have an account?{" "}
        <a
          className="signup-txt"
          onClick={() => {
            navigate("/");
          }}
        >
          Sign Up
        </a>
      </div>
    </div>
  );
}
