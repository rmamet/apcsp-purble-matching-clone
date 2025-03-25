import { useState, useEffect } from "react";

function App() {
  const [shuffled, setShuffled] = useState([]);
  const characters = ["A", "B", "C", "D", "E", "F", "G"];
  const [difficulty, setDifficulty] = useState("");

  const [selected, setSelected] = useState([]);

  if (selected.length == 2) {
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
  }

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
      listChars = characters.slice(0, 3); // Get first 3 characters
    } else if (diff === "Medium") {
      listChars = characters.slice(0, 5); // Get first 5 characters
    } else if (diff === "Hard") {
      listChars = characters.slice(0, 7); // Get all characters
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
        className="text-white"
      >
        <option disabled={true} value=""></option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <p className="text-white">{shuffled}</p>
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
                    console.log(p.target.id);
                    p.target.className = "text-green-200 text-center border-2";
                    // checkSelected();
                  }}
                >
                  {shuffled[i]}
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
