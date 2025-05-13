import { useState } from "react";
import api from "./api";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await api.get("/test/");
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error connecting to API");
    }
    setLoading(false);
  };

  return (
    <>
      <div>
        <button onClick={handleClick} disabled={loading}>
          {loading ? "Loading..." : "Call API"}
        </button>
        <div style={{ marginTop: "1rem" }}>
          <strong>API Response:</strong> {message}
        </div>
      </div>
    </>
  );
}

export default App;
