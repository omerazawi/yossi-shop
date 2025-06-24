import { useState }    from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Auth.css';

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err , setErr ] = useState("");

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await axios.post(
        "http://localhost:3001/auth/login",
        form
      );
      localStorage.setItem("token", data.token);
      nav("/");               // חזרה לחנות
    } catch {
      setErr("אימייל או סיסמה שגויים");
    }
  };

  return (
    <form onSubmit={submit} className="auth-form">
      <h2>התחברות</h2>
      {err && <p className="error">{err}</p>}

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
      <button>התחבר</button>
    </form>
  );
}
