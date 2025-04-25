import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateIssue from "./pages/CreateIssue";

import "./App.css";

function App() {


  return (

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/CreateIssue" element={<CreateIssue />} />
      </Routes>

  );
}

export default App;
