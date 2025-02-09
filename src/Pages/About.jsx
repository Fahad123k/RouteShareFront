import { useEffect } from "react";
import { useNavigate } from "react-router";


const About = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized! Please log in.");
      navigate("/");  // Redirect to login if no token
    }
  }, [navigate])
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
      <button onClick={() => {
        localStorage.removeItem("token");
        navigate("/");
      }} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  )
}

export default About