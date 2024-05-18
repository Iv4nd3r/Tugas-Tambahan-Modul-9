import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "./assets/react.svg";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "My Events";
      case "/create-event":
        return "Create Event";
      case "/scan-ticket":
        return "Scan Ticket";
      case "edit-event/:id":
        return "Edit Event";
      default:
        if (location.pathname.startsWith("/edit-event/")) {
          return "Edit Event";
        }
        return "";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-200">
      <Link to="/">
        <img src={logo} alt="Logo" />
      </Link>
      <h1 className="text-xl font-bold">{getTitle()}</h1>
      {location.pathname !== "/" && (
        <button
          className="px-4 py-2 rounded-full bg-blue-500 text-white"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      )}
    </div>
  );
};

export default Navbar;
