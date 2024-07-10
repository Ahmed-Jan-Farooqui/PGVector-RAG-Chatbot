import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./components/signup/SignUp";
import HomePage from "./components/home/HomePage";
import Login from "./components/login/Login";
import ChatPage from "./components/chat/ChatPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/chat" element={<ChatPage />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
