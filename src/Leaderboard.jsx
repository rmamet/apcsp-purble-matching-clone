import { useState, useEffect } from "react";

function Leaderboard({
  difficulty,
  refreshLeaderboard,
  setRefreshLeaderboard,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [scoresResponse, setScoresResponse] = useState();

  useEffect(() => {
    async function fetchLeaderboardScores() {
      setIsLoading(true);

      try {
        const res = await fetch(
          `https://api.rmamet.xyz/memoryscores?difficulty=${encodeURIComponent(difficulty)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const json = await res.json();

        setScoresResponse(json);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboardScores();
    if (refreshLeaderboard) {
      setRefreshLeaderboard(false);
    }
  }, [difficulty, refreshLeaderboard, setRefreshLeaderboard]);

  return (
    <div className="m-4 p-4 bg-linear-to-br from-slate-800 to-slate-700 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-amber-300 mb-2">
        Leaderboard 🏆{" "}
        <span className="text-sm text-slate-300">
          {difficulty || "Select difficulty"}
        </span>
      </h2>
      {isLoading ? (
        <p className="text-slate-300">Loading...</p>
      ) : (
        <ol className="space-y-2">
          {scoresResponse &&
          scoresResponse.data &&
          scoresResponse.data.length > 0 ? (
            scoresResponse.data.map((entry, index) => (
              <li
                key={entry.id}
                className="flex items-center justify-between bg-slate-900 bg-opacity-20 p-3 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {index === 0 ? (
                      "🥇"
                    ) : index === 1 ? (
                      "🥈"
                    ) : index === 2 ? (
                      "🥉"
                    ) : (
                      <span className="text-sm text-slate-400">
                        #{index + 1}
                      </span>
                    )}
                  </span>
                  <div>
                    <div className="font-medium">{entry.uname}</div>
                    <div className="text-sm text-slate-400">
                      Score: {entry.score}
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
