import { useState } from "react";

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

  const checkSelected = () => {
    let values = [];
    for (let i = 0; i < selected.length; i++) {
      values.push(shuffled[selected[i]]);
    }
    if (values[0] == values[1]) {
      let oldShuffled = shuffled;
      for (let i = 0; i < selected.length; i++) {
        oldShuffled[selected[i]] = "ZZZ";
      }
      setShuffled(oldShuffled.filter((p) => !(p == "ZZZ")));
    }
    setSelected([]);
  };
  if (selected.length === 2) {
    // wait a little before checking the options
    setTimeout(() => {
      checkSelected();
    }, 500);
  }
  const checkHidden = (i) => {
    let shown = "hidden";
    for (let j = 0; j < selected.length; j++) {
      if (i == selected[j]) {
        shown = shuffled[i];
      }
    }
    return shown;
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
    let extraChars = [];
    for (let i = 0; i < listChars.length; i++) {
      extraChars.push(listChars[i]);
    }
    for (let i = 0; i < extraChars.length; i++) {
      listChars.push(extraChars[i]);
    }

    const shuffledArray = shuffle(listChars);
    setShuffled(shuffledArray);
  };

  return (
    <>
      <select
        value={difficulty}
        onChange={(p) => difficulyChange(p.target.value)}
        className="text-white bg-slate-800"
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
      {difficulty === "Easy" && (
        <div className="grid grid-rows-2 grid-cols-3">
          {(() => {
            const items = [];
            for (let i = 0; i < shuffled.length; i++) {
              items.push(
                <div
                  className="text-white text-center border-2"
                  id={i}
                  key={i}
                  onClick={(p) => {
                    if (selected[0] == p.target.id) {
                      return;
                    }
                    let tempArr = [];
                    for (let i = 0; i < selected.length; i++) {
                      tempArr.push(selected[i]);
                    }
                    tempArr.push(p.target.id);
                    setSelected(tempArr);
                  }}
                >
                  {checkHidden(i)}
                </div>
              );
            }
            return items;
          })()}
        </div>
      )}
      {difficulty === "Medium" && (
        <div className="grid grid-rows-2 grid-cols-5">
          {(() => {
            const items = [];
            for (let i = 0; i < shuffled.length; i++) {
              items.push(
                <div
                  className="text-white text-center border-2"
                  id={i}
                  key={i}
                  onClick={(p) => {
                    if (selected[0] == p.target.id) {
                      return;
                    }
                    let tempArr = [];
                    for (let i = 0; i < selected.length; i++) {
                      tempArr.push(selected[i]);
                    }
                    tempArr.push(p.target.id);
                    setSelected(tempArr);
                  }}
                >
                  {checkHidden(i)}
                </div>
              );
            }
            return items;
          })()}
        </div>
      )}
      {difficulty === "Hard" && (
        <div className="grid grid-rows-4 grid-cols-4">
          {(() => {
            const items = [];
            for (let i = 0; i < shuffled.length; i++) {
              items.push(
                <div
                  className="text-white text-center border-2"
                  id={i}
                  key={i}
                  onClick={(p) => {
                    if (selected[0] == p.target.id) {
                      return;
                    }
                    let tempArr = [];
                    for (let i = 0; i < selected.length; i++) {
                      tempArr.push(selected[i]);
                    }
                    tempArr.push(p.target.id);
                    setSelected(tempArr);
                  }}
                >
                  {checkHidden(i)}
                </div>
              );
            }
            return items;
          })()}
        </div>
      )}
      {difficulty === "Secret" && (
        <div className="grid grid-rows-4 grid-cols-13">
          {(() => {
            const items = [];
            for (let i = 0; i < shuffled.length; i++) {
              items.push(
                <div
                  className="text-white text-center border-2"
                  id={i}
                  key={i}
                  onClick={(p) => {
                    if (selected[0] == p.target.id) {
                      return;
                    }
                    let tempArr = [];
                    for (let i = 0; i < selected.length; i++) {
                      tempArr.push(selected[i]);
                    }
                    tempArr.push(p.target.id);
                    setSelected(tempArr);
                  }}
                >
                  {checkHidden(i)}
                </div>
              );
            }
            return items;
          })()}
        </div>
      )}
    </>
  );
}

export default App;
