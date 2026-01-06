import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uname, setUname] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://api.rmamet.xyz/loginapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uname: uname, password: password }),
      });

      const data = await res.json();

      if (data?.data) {
        localStorage.setItem("auth_token", data.data);
        localStorage.setItem("uname", uname);
      }
      if (res.status == 200) {
        setMessage("Logged In!");
        setTimeout(function () {
          window.location.href = "/";
        }, 2000);
      } else if (res.status == 201) {
        setMessage("Account Created");
        setPassword("");
        setTimeout(function () {
          window.location.href = "/";
        }, 2000);
      } else {
        setMessage(data?.message);
      }
    } catch (e) {
      setMessage(toString(e));
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function deleteAccount() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://api.rmamet.xyz/loginapi", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uname: localStorage.getItem("uname"),
          password: password,
          token: localStorage.getItem("auth_token"),
        }),
      });

      const data = await res.json();
      if (res.status == 200) {
        setMessage("Account deleted!");
        setPassword("");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("uname");
        setTimeout(function () {
          window.location.href = "/";
        }, 2000);
      } else {
        setMessage(data?.message);
      }
    } catch (e) {
      setMessage(e?.message ?? String(e));
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function logOut() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("uname");
    window.location.reload();
  }

  return (
    <div className="w-full max-w-md mx-auto bg-linear-to-br from-slate-800 to-slate-700 rounded-2xl p-6 shadow-lg">
      {localStorage.getItem("auth_token") ? (
        <>
          <h1 className="text-3xl font-bold text-amber-300 mb-2">
            Manage Account
          </h1>
          <p className="text-slate-200 mb-4">
            Logged in as{" "}
            <span className="font-medium">{localStorage.getItem("uname")}</span>
          </p>
          <div className="flex gap-3 items-center mb-4">
            <button
              onClick={logOut}
              className="px-4 py-2 bg-slate-700 rounded-md text-white hover:bg-slate-600"
            >
              Log Out
            </button>
          </div>
          <h2 className="text-xl text-white mb-1">Delete account?</h2>
          <small className="text-xs text-slate-300 block mb-3">
            Account deletion deletes all login information and scores for the
            current account. No information is kept upon account deletion. For
            any questions, contact{" "}
            <a className="text-amber-300" href="mailto:admin@rmamet.xyz">
              admin@rmamet.xyz
            </a>
          </small>
          <label className="text-slate-200 block mb-1">Password</label>
          <input
            type="password"
            onChange={(p) => setPassword(p.target.value)}
            value={password}
            className="w-full p-2 rounded-md mb-3 bg-slate-900 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            onClick={deleteAccount}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md"
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
          {message && <p className="mt-3 text-slate-200">{message}</p>}
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-amber-300 mb-4">Login</h1>
          <label className="text-slate-200 block mb-1">Username</label>
          <input
            onChange={(p) => setUname(p.target.value)}
            value={uname}
            className="w-full p-2 rounded-md mb-3 bg-slate-900 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <label className="text-slate-200 block mb-1">Password</label>
          <input
            type="password"
            onChange={(p) => setPassword(p.target.value)}
            value={password}
            className="w-full p-2 rounded-md mb-3 bg-slate-900 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <div className="flex gap-3">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-md font-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              onClick={() => {
                setUname("");
                setPassword("");
                setMessage("");
              }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md"
            >
              Reset
            </button>
          </div>
          {message && <p className="mt-3 text-slate-200">{message}</p>}
        </>
      )}
    </div>
  );
}
