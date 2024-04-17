import { Link } from "react-router-dom";
import "../styles/Footer.scss";
import { LocationOn, LocalPhone, Email } from "@mui/icons-material";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer_left">
        <Link to="/">
          <img src="/assets/logo.png" alt="Logo" />
        </Link>
      </div>

      <div className="footer_center">
        <h3>Useful links</h3>
        <ul>
          <li>About Us</li>
          <li>Terms and Conditions</li>
          <li>Return/Refund Policy</li>
        </ul>
      </div>

      <div className="footer_right">
        <h3>Contact</h3>
        <div className="footer_right_info">
          <LocalPhone />
          <p>+234 813 455 7536</p>
        </div>
        <div className="footer_right_info">
          <Email />
          <p>jacobadebayo.ja@gmail.com</p>
        </div>
        <div className="footer_right_info">
          <LocationOn />
          <p>Lagos, Nigeria.</p>
        </div>
        <img src="/assets/payment.png" alt="payment" />
      </div>
    </div>
  );
};

export default Footer;
