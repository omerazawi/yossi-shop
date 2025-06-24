import { useState }    from "react";
import { useNavigate } from "react-router-dom";
import api             from "../../api";
import "./Auth.css";

export default function Login() {
  const nav = useNavigate();
  const [form,  setForm ] = useState({ email: "", password: "" });
  const [err , setErr  ] = useState("");
  const [load, setLoad ] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoad(true);
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      nav("/");
    } catch {
      setErr("אימייל או סיסמה שגויים");
    } finally {
      setLoad(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={submit}>
      <h2>התחברות</h2>
      {err && <p className="error">{err}</p>}

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
      <button disabled={load}>{load ? "טוען..." : "התחבר"}</button>
    </form>
  );
}
