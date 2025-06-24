import { useState }    from "react";
import { useNavigate } from "react-router-dom";
import api             from "../../api";
import "./Auth.css";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    fullName: "", email: "", password: ""
  });
  const [err, setErr] = useState("");

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await api.post("/auth/register", form);
      localStorage.setItem("token", data.token);
      nav("/");
    } catch {
      setErr("מייל כבר רשום או פרטים שגויים");
    }
  };

  return (
    <form className="auth-form" onSubmit={submit}>
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
        type="email"
        placeholder="אימייל"
        onChange={onChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="סיסמה"
        onChange={onChange}
        required
      />
      <button>הרשמה</button>
    </form>
  );
}
