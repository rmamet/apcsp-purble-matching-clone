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
    <>
      {localStorage.getItem("auth_token") ? (
        <>
          <h1 className="text-[3em] text-white">Manage Account</h1>
          <p className="text-white">
            Logged in as {localStorage.getItem("uname")}
          </p>
          <button
            onClick={logOut}
            className="p-1 text-white rounded-md border-2 border-solid border-amber-50"
          >
            Log Out
          </button>
          <br />
          <br />
          <h2 className="text-[2em] text-white">Delete account?</h2>
          <small className="text-xs text-zinc-400">
            Account deletion deletes all login information and scores for the
            current account. No information is kept apon account deletion. For
            any questions or concerns, contact webadmin at{" "}
            <a href="mailto:admin@rmamet.xyz">admin@rmamet.xyz</a>
          </small>
          <br />
          <label className="text-white">Password: </label>
          <input
            type="password"
            onChange={(p) => {
              setPassword(p.target.value);
            }}
            className="bg-white important text-black border-2 border-green-300 border-solid"
          ></input>
          <br />
          <button
            className="p-1 text-white rounded-md border-2 border-solid border-amber-50 hover:border-red-400 hover:text-red-500"
            onClick={deleteAccount}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
          {message && <p className="text-white">{message}</p>}
        </>
      ) : (
        <div>
          <h1 className="text-[3em] text-white">Login</h1>
          <label className="text-white">Username: </label>
          <input
            onChange={(p) => {
              setUname(p.target.value);
            }}
            className="bg-white important text-black border-2 border-green-300 border-solid"
          ></input>
          <br />
          <label className="text-white">Password: </label>
          <input
            type="password"
            onChange={(p) => {
              setPassword(p.target.value);
            }}
            className="bg-white important text-black border-2 border-green-300 border-solid"
          ></input>
          <br />
          <button
            className="p-1 text-white rounded-md border-2 border-solid border-amber-50"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {message && <p className="text-white">{message}</p>}
        </div>
      )}
    </>
  );
}
