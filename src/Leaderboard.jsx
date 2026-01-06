import { useState, useEffect } from "react";

function Leaderboard({ difficulty, reload, setReload }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    async function getScores() {
      setLoading(true);

      try {
        const res = await fetch(
          `https://api.rmamet.xyz/memoryscores?difficulty=${encodeURIComponent(difficulty)}`,
          // `https://api.rmamet.xyz/memoryscores?difficulty=${encodeURIComponent('Non-Existant')}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const json = await res.json();

        setData(json);

        // setMessage(JSON.stringify(data?.data));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    getScores();
    if (reload) {
      setReload(false);
    }
  }, [difficulty, reload, setReload]);

  return (
    <div className="m-4 p-4 bg-linear-to-br from-slate-800 to-slate-700 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-amber-300 mb-2">
        Leaderboard 🏆{" "}
        <span className="text-sm text-slate-300">
          {difficulty || "Select difficulty"}
        </span>
      </h2>
      {loading ? (
        <p className="text-slate-300">Loading...</p>
      ) : (
        <ol className="space-y-2">
          {data && data.data && data.data.length > 0 ? (
            data.data.map((item, idx) => (
              <li
                key={item.id}
                className="flex items-center justify-between bg-slate-900 bg-opacity-20 p-3 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {idx === 0 ? (
                      "🥇"
                    ) : idx === 1 ? (
                      "🥈"
                    ) : idx === 2 ? (
                      "🥉"
                    ) : (
                      <span className="text-sm text-slate-400">#{idx + 1}</span>
                    )}
                  </span>
                  <div>
                    <div className="font-medium">{item.uname}</div>
                    <div className="text-sm text-slate-400">
                      Score: {item.score}
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-slate-300">No scores yet... be the first!</p>
          )}
        </ol>
      )}
    </div>
  );
}

export default Leaderboard;
