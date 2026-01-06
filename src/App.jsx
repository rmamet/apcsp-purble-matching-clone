import { useState, useEffect, useRef } from "react";
import Leaderboard from "./Leaderboard";

function App() {
  const [shuffled, setShuffled] = useState([]);
  const characters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const [difficulty, setDifficulty] = useState("");
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [reload, setReload] = useState(false);

  const prev = useRef(shuffled);

  useEffect(() => {
    const becameEmpty = prev.current.length > 0 && shuffled.length === 0;
    prev.current = shuffled;

    const run = async () => {
      if (becameEmpty && localStorage.getItem("auth_token")) {
        setReload(true);
        await fetch("https://api.rmamet.xyz/memoryscores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uname: localStorage.getItem("uname"),
            token: localStorage.getItem("auth_token"),
            score,
            difficulty,
          }),
        });
      }
    };

    run();
  }, [shuffled, score, difficulty]);

  const checkSelected = async () => {
    let values = [];
    for (let i = 0; i < selected.length; i++) {
      values.push(shuffled[selected[i]]);
    }
    if (values[0] == values[1]) {
      setMatched((prev) => {
        const copy = [...prev];
        for (let i = 0; i < selected.length; i++) {
          copy[selected[i]] = true;
        }
        if (copy.length > 0 && copy.every(Boolean)) {
          setTimeout(() => setShuffled([]), 400);
        }
        return copy;
      });
    } else {
      setScore(score + 1);
    }

    setSelected([]);
  };
  if (selected.length === 2) {
    setTimeout(() => {
      checkSelected();
    }, 500);
  }
  const checkHidden = (i) => {
    if (matched[i]) return "matched";
    for (let j = 0; j < selected.length; j++) {
      if (i === selected[j]) {
        return shuffled[i];
      }
    }
    return "hidden";
  };

  // shuffle function from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

  function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  const difficulyChange = (diff) => {
    setDifficulty(diff);
    setScore(0);
    let listChars = [];
    if (diff === "Easy") {
      listChars = characters.slice(0, 3);
    } else if (diff === "Medium") {
      listChars = characters.slice(0, 5);
    } else if (diff === "Hard") {
      listChars = characters.slice(0, 8);
    } else if (diff === "Secret") {
      listChars = characters;
    }

    const doubled = [...listChars, ...listChars];

    const shuffledArray = shuffle(doubled);
    setShuffled(shuffledArray);
    setMatched(Array(shuffledArray.length).fill(false));
    setSelected([]);
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Purble Matching Game Clone
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              But without the actual purble assets because thats stealing
            </p>
            <small className="text-xs text-zinc-400 mt-1">
              ... so this is just a normal matching/memory game
            </small>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-white">
              Score: <span className="font-bold">{score}</span>
            </div>
            {localStorage.getItem("auth_token") ? (
              <>
                <div className="text-sm text-slate-200">
                  Logged in:{" "}
                  <span className="font-medium">
                    {localStorage.getItem("uname")}
                  </span>
                </div>
                <button
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-md text-white shadow"
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                >
                  Manage
                </button>
              </>
            ) : (
              <button
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 rounded-md text-slate-900 font-semibold shadow"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Log In
              </button>
            )}
          </div>
        </header>

        <div className="flex items-center gap-4">
          <label className="text-sm text-slate-300">Difficulty</label>
          <select
            value={difficulty}
            onChange={(p) => difficulyChange(p.target.value)}
            className="text-white bg-slate-700 rounded-md p-2 border border-slate-600"
          >
            <option disabled={true} value="">
              Select a Difficulty
            </option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Secret">Secret</option>
          </select>
          {/* <p className="text-white">{shuffled}</p> */}
        </div>
        {difficulty === "Easy" && (
          <div className="grid grid-rows-2 grid-cols-3 gap-3 p-4 bg-slate-800 rounded-md shadow">
            {(() => {
              const items = [];
              for (let i = 0; i < shuffled.length; i++) {
                items.push(
                  <div
                    id={i}
                    key={i}
                    onClick={(e) => {
                      const id = Number(e.currentTarget.id);
                      if (matched[id]) return;
                      if (selected.length >= 2) return;
                      if (selected[0] === id) return;
                      setSelected((s) => [...s, id]);
                    }}
                    className={`rounded-md cursor-pointer select-none transition-transform duration-150 ${checkHidden(i) === "hidden" ? "bg-slate-700 hover:scale-105" : checkHidden(i) === "matched" ? "bg-emerald-600 text-white shadow-inner scale-100" : "bg-amber-400 scale-100"}`}
                  >
                    <div
                      className={`aspect-square flex items-center justify-center text-2xl font-bold ${checkHidden(i) === "hidden" || checkHidden(i) === "matched" ? "text-white" : "text-slate-900"}`}
                    >
                      {checkHidden(i) === "hidden" ? "?" : shuffled[i]}
                    </div>
                  </div>
                );
              }
              return items;
            })()}
          </div>
        )}
        {difficulty === "Medium" && (
          <div className="grid grid-rows-2 grid-cols-5 gap-3 p-4 bg-slate-800 rounded-md shadow">
            {(() => {
              const items = [];
              for (let i = 0; i < shuffled.length; i++) {
                items.push(
                  <div
                    id={i}
                    key={i}
                    onClick={(e) => {
                      const id = Number(e.currentTarget.id);
                      if (matched[id]) return;
                      if (selected.length >= 2) return;
                      if (selected[0] === id) return;
                      setSelected((s) => [...s, id]);
                    }}
                    className={`rounded-md cursor-pointer select-none transition-transform duration-150 ${checkHidden(i) === "hidden" ? "bg-slate-700 hover:scale-105" : checkHidden(i) === "matched" ? "bg-emerald-600 text-white shadow-inner scale-100" : "bg-amber-400 scale-100"}`}
                  >
                    <div
                      className={`aspect-square flex items-center justify-center text-2xl font-bold ${checkHidden(i) === "hidden" || checkHidden(i) === "matched" ? "text-white" : "text-slate-900"}`}
                    >
                      {checkHidden(i) === "hidden" ? "?" : shuffled[i]}
                    </div>
                  </div>
                );
              }
              return items;
            })()}
          </div>
        )}
        {difficulty === "Hard" && (
          <div className="grid grid-rows-4 grid-cols-4 gap-3 p-4 bg-slate-800 rounded-md shadow">
            {(() => {
              const items = [];
              for (let i = 0; i < shuffled.length; i++) {
                items.push(
                  <div
                    id={i}
                    key={i}
                    onClick={(e) => {
                      const id = Number(e.currentTarget.id);
                      if (matched[id]) return;
                      if (selected.length >= 2) return;
                      if (selected[0] === id) return;
                      setSelected((s) => [...s, id]);
                    }}
                    className={`rounded-md cursor-pointer select-none transition-transform duration-150 ${checkHidden(i) === "hidden" ? "bg-slate-700 hover:scale-105" : checkHidden(i) === "matched" ? "bg-emerald-600 text-white shadow-inner scale-100" : "bg-amber-400 scale-100"}`}
                  >
                    <div
                      className={`aspect-square flex items-center justify-center text-2xl font-bold ${checkHidden(i) === "hidden" || checkHidden(i) === "matched" ? "text-white" : "text-slate-900"}`}
                    >
                      {checkHidden(i) === "hidden" ? "?" : shuffled[i]}
                    </div>
                  </div>
                );
              }
              return items;
            })()}
          </div>
        )}
        {difficulty === "Secret" && (
          <div className="grid grid-rows-4 grid-cols-13 gap-2 p-4 bg-slate-800 rounded-md shadow">
            {(() => {
              const items = [];
              for (let i = 0; i < shuffled.length; i++) {
                items.push(
                  <div
                    id={i}
                    key={i}
                    onClick={(e) => {
                      const id = Number(e.currentTarget.id);
                      if (matched[id]) return;
                      if (selected.length >= 2) return;
                      if (selected[0] === id) return;
                      setSelected((s) => [...s, id]);
                    }}
                    className={`rounded-md cursor-pointer select-none transition-transform duration-150 ${checkHidden(i) === "hidden" ? "bg-slate-700 hover:scale-105" : checkHidden(i) === "matched" ? "bg-emerald-600 text-white shadow-inner scale-100" : "bg-amber-400 scale-100"}`}
                  >
                    <div
                      className={`aspect-square flex items-center justify-center text-2xl font-bold ${checkHidden(i) === "hidden" || checkHidden(i) === "matched" ? "text-white" : "text-slate-900"}`}
                    >
                      {checkHidden(i) === "hidden" ? "?" : shuffled[i]}
                    </div>
                  </div>
                );
              }
              return items;
            })()}
          </div>
        )}
        <div className="mt-6">
          <Leaderboard
            difficulty={difficulty}
            reload={reload}
            setReload={setReload}
          />
        </div>
      </div>
    </>
  );
}

export default App;
