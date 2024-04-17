import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.scss";
import { useAppDispatch } from "../redux/hook";
import { setLogin } from "../redux/userSlice";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const userData = { email, password };
      const response = await fetch(
        `${import.meta.env.VITE_APP_SERVER_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      // const cookies = document.cookie.split(";");
      // let jwtoken = "";

      // cookies.forEach((cookie) => {
      //   const [name, value] = cookie.trim().split("=");
      //   if (name === "jwtoken") {
      //     jwtoken = value;
      //     return;
      //   }
      // });

      // console.log("JWT token:", jwtoken);

      const data = await response.json();
      if (response.ok) {
        dispatch(
          setLogin({
            user: data.user,
            token: data.token,
          })
        );
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      toast.error("User login failed.");
    }
  };

  return (
    <section className="login">
      <section className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <button type="submit">LOG IN</button>
        </form>
        <Link to="/register">Don't have an account? Sign up here.</Link>
      </section>
    </section>
  );
};

export default LoginPage;
