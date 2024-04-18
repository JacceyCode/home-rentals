import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { setLogout } from "../redux/userSlice";
import "../styles/Navbar.scss";
import { toast } from "react-toastify";

const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_SERVER_URL}/auth/logout`
    );

    await response.json();
    if (response.ok) {
      toast.success("User successfully logged out.");
      dispatch(setLogout());
    }
  };

  return (
    <header className="navbar">
      <Link to="/">
        <img src="/assets/logo.png" alt="Logo" />
      </Link>

      <form
        className="navbar_search"
        onSubmit={() => {
          search !== "" && navigate(`/properties/search/${search}`);
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton
          onClick={() => navigate(`/properties/search/${search}`)}
          disabled={search === ""}
        >
          <Search sx={{ color: "#f8395a" }} />
        </IconButton>
      </form>

      <section className="navbar_right">
        {user ? (
          <Link to="/create-listing" className="host">
            Become a host
          </Link>
        ) : (
          <Link to="/login" className="host">
            Become a host
          </Link>
        )}

        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu((prev) => !prev)}
        >
          <Menu sx={{ color: "#969393" }} />
          {!user ? (
            <Person sx={{ color: "#969393" }} />
          ) : (
            <img
              src={`${import.meta.env.VITE_APP_SERVER_URL}/${
                user.profileImagePath
              }`}
              alt="Profile Photo"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          )}
        </button>

        {dropdownMenu && (
          <section className="navbar_right_accountmenu">
            {!user ? (
              <>
                <Link to="/login">Log In</Link>
                <Link to="/register">Sign Up</Link>
              </>
            ) : (
              <>
                <Link to={`/${user._id}/trips`}>Trip List</Link>
                <Link to={`/${user._id}/wishList`}>Wish List</Link>
                <Link to={`/${user._id}/properties`}>Property List</Link>
                <Link to={`/${user._id}/reservations`}>Reservation List</Link>
                <Link to="/create-listing">Become A Host</Link>

                <Link to="/login" onClick={handleLogout}>
                  Log Out
                </Link>
              </>
            )}
          </section>
        )}
      </section>
    </header>
  );
};

export default Navbar;
