import { Link } from "react-router-dom";
import "../styles/Error.scss";

const ErrorPage = () => {
  return (
    <div className="error">
      <h1>Error loading page 💥💥💥</h1>
      <h3>Could not locate the url address.</h3>
      <Link to="/">Go back to home page 🏠</Link>
    </div>
  );
};

export default ErrorPage;
