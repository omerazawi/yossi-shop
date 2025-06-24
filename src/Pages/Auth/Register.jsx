import { useState }    from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Auth.css';

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [err , setErr ] = useState("");

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await axios.post(
        "http://localhost:3001/auth/register",
        form
      );
      localStorage.setItem("token", data.token);
      nav("/");               // דף הבית או products
    } catch {
      setErr("מייל כבר רשום או פרטים לא תקינים");
    }
  };

  return (
    <form onSubmit={submit} className="auth-form">
      <h2>הרשמה</h2>
      {err && <p className="error">{err}</p>}

      <input
        name="fullName"
        placeholder="שם מלא"
        onChange={onChange}
        required
      />
      <input
        name="email"
        placeholder="אימייל"
        type="email"
        onChange={onChange}
        required
      />
      <input
        name="password"
        placeholder="סיסמה"
        type="password"
        onChange={onChange}
        required
      />
      <button>הרשמה</button>
    </form>
  );
}
