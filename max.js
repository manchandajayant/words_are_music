const maxApi = require("max-api");
const fetch = require("node-fetch");

var freqArr = [
  {
    note: "c",
    frequency: [16.35, 32.7, 65.41, 130.81],
  },
  {
    note: "d",
    frequency: [18.35, 36.71, 73.42, 146.83],
  },
  {
    note: "e",
    frequency: [20.6, 41.2, 82.41, 164.81],
  },
  {
    note: "f",
    frequency: [21.83, 43.65, 87.31, 174.61],
  },
  {
    note: "g",
    frequency: [24.5, 49.0, 98.0, 196.0],
  },
  {
    note: "a",
    frequency: [27.5, 55.0, 110.0, 220.0],
  },
  {
    note: "b",
    frequency: [30.87, 61.74, 123.47, 246.94],
  },
];

var word;
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

maxApi.addHandler("fetch", () => {
  maxApi.post("fetching");
  fetchWords();
});

const fetchWords = () => {
  let wordArr = [];
  let pushArr = [];
  let returnVal = [];
  fetch("https://random-words-api.vercel.app/word")
    .then((res) => res.json())
    .then((result) => {
      word = result[0].word || "Youngstock";
      maxApi.post("word:", word);
      wordArr = result[0].word.split("");
      wordArr = wordArr.map((r) => r.toLowerCase());
      for (let x = 0; x < wordArr.length; x++) {
        let filtered = freqArr.filter((b) => b.note === wordArr[x]);
        if (filtered.length) {
          pushArr.push(filtered);
        }
      }

      if (pushArr.length) {
        pushArr.forEach((s) => {
          returnVal.push(s[0].frequency[getRandomInt(s[0].frequency.length)]);
        });
      }

      if (returnVal.length < 4) {
        for (let i = 0; i < 4; i++) {
          let v = freqArr[getRandomInt(freqArr.length)];
          let randomPick = v.frequency[getRandomInt(v.frequency.length)];
          returnVal.push(randomPick);
        }
        returnVal = returnVal.map((t) => t * 4);
        let m = { val: returnVal, word: word };
        maxApi.outlet("data", m);
      }
    })
    .catch((e) => {
      maxApi.outlet("error");
    });
};

// if (process.argv[2] == 2) {
//   fetchWords();
// }
