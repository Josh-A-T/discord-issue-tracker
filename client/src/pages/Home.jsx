import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <h1>Discord issue tracker</h1>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        className="logout-btn"
      >
        Logout
      </button>
    </div>
  );
}
