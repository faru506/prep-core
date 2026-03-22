import { Link } from "react-router-dom";

function Navbar() {

  const token =
    localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav style={{
      padding: "10px",
      background: "#eee"
    }}>

      <Link to="/">Home</Link>{" | "}

      {!token ? (
        <>
          <Link to="/login">Login</Link>{" | "}
          <Link to="/signup">Signup</Link>
        </>
      ) : (
        <button onClick={handleLogout}>
          Logout
        </button>
      )}

    </nav>
  );
}

export default Navbar;