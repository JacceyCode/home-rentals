import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.scss";
import { toast } from "react-toastify";

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImage: MediaSource | null;
};

const RegisterPage = () => {
  const [formData, setFormData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { name, value, files } = e.target;

    const newValue =
      name === "profileImage" && files && files[0] ? files[0] : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword ||
        formData.confirmPassword === ""
    );
  }, [formData.confirmPassword, formData.password]);

  const handleSUbmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const register_form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        register_form.append(key, value as string);
      });

      const res = await fetch(
        `${import.meta.env.VITE_APP_SERVER_URL}/auth/register`,
        {
          method: "POST",
          body: register_form,
        }
      );

      await res.json();

      if (res.ok) {
        navigate("/login");
        toast.success("User registration successful! Kindly sign in.");
      }
      // } else {
      //   toast.error("Error signing up user! Please try again.");
      // }
    } catch (err) {
      console.log(err);
      toast.error("Error signing up user! Please try again.");
    }
  };

  return (
    <section className="register">
      <article className="register_content">
        <form className="register_content_form" onSubmit={handleSUbmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords does not match</p>
          )}

          <input
            type="file"
            accept="image/*"
            name="profileImage"
            id="profile-image"
            onChange={handleChange}
            style={{ display: "none" }}
          />
          <label htmlFor="profile-image">
            <img src="/assets/addImage.png" alt="Upload profile image" />
            <p>Upload Profile Image</p>
          </label>

          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="Profile Image"
              style={{
                maxWidth: "80px",
                aspectRatio: 1 / 1,
                borderRadius: "50%",
              }}
            />
          )}

          <button type="submit" disabled={!passwordMatch}>
            REGISTER
          </button>
        </form>

        <Link to="/login">Already have an account? Log in here.</Link>
      </article>
    </section>
  );
};

export default RegisterPage;
