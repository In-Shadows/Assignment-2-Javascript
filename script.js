"use strict";

// DOM VARIABLES
const inputSkill = document.querySelector("select");
const inputTodayScore = document.querySelector("#today-score");
const inputFutureScore = document.querySelector("#future-score");
const submitBtn = document.querySelector(".btn");
const p1 = document.querySelector(".p1");
const p2 = document.querySelector(".p2");

// VARIABLES
const todayRanks = [];
const futureRanks = [];
const top3TodayRanks = [];
const top3FutureRanks = [];
const bottom3TodayRanks = [];
const bottom3FutureRanks = [];
const acceleratingSkills = [];
const decliningSkills = [];

// DATA FETCHING VARIABLES
const url = "data.json";
let fetchedData;

// FUNCTIONS
const nameScoreAndSortDesc = (arr, year, sub = false) => {
  fetchedData.forEach((skill) => {
    arr.push({
      name: skill.name,
      score: sub
        ? +skill["2019"].slice(0, -1) - +skill["2024"].slice(0, -1)
        : year === 2019
        ? skill["2019"].slice(0, -1)
        : skill["2024"].slice(0, -1),
    });
  });
  arr.sort((a, b) => b.score - a.score);
};

const assignRank = (arr) => {
  arr.forEach((skill, i) => (skill.rank = i + 1));
};

const calculateTodaysRanks = () => {
  const nameAndScoreToday = [];
  nameScoreAndSortDesc(nameAndScoreToday, 2019);
  assignRank(nameAndScoreToday);
  todayRanks.push(...nameAndScoreToday);
};

const calculateFutureRanks = () => {
  const nameAndScoreFuture = [];
  nameScoreAndSortDesc(nameAndScoreFuture, 2024);
  assignRank(nameAndScoreFuture);
  futureRanks.push(...nameAndScoreFuture);
};

const calculateTop3Ranks = () => {
  top3TodayRanks.push(...todayRanks.slice(0, 3));
  top3FutureRanks.push(...futureRanks.slice(0, 3));
};

const calculateBottom3Ranks = () => {
  bottom3TodayRanks.push(...todayRanks.slice(-3));
  bottom3FutureRanks.push(...futureRanks.slice(-3));
};

const calculateAcceleratingSkills = () => {
  const accSkills = [];
  nameScoreAndSortDesc(accSkills, null, true);
  acceleratingSkills.push(
    ...accSkills.slice(0, 3).filter((skill) => skill.score > 0)
  );
};

const calculateDecliningSkills = () => {
  const decSkills = [];
  nameScoreAndSortDesc(decSkills, null, true);
  decliningSkills.push(
    ...decSkills.slice(-3).filter((skill) => skill.score < 0)
  );
  decliningSkills.reverse();
};

const resetInputs = () => {
  inputSkill.value = "";
  inputTodayScore.value = "";
  inputFutureScore.value = "";
};

const getRank = (e) => {
  e.preventDefault();
  const skill = inputSkill.value;
  let todayScore = inputTodayScore.value;
  let futureScore = inputFutureScore.value;

  if (
    skill.length === 0 ||
    todayScore <= 0 ||
    todayScore > 100 ||
    futureScore <= 0 ||
    futureScore > 100
  ) {
    console.log();
    alert("Please enter valid scores and select a skill");
    return;
  }
  todayScore += "%";
  futureScore += "%";

  fetchedData.forEach((sk) => {
    if (sk.name === skill) {
      sk["2019"] = todayScore;
      sk["2024"] = futureScore;
    }
  });
  calculateAllRanks();

  todayRanks.forEach((sk) => {
    sk.name === skill ? (p1.textContent = `The Rank Today is ${sk.rank}`) : "";
  });
  futureRanks.forEach((sk) => {
    sk.name === skill
      ? (p2.textContent = `The Rank in Future is ${sk.rank}`)
      : "";
  });
  resetInputs();
};

const calculateAllRanks = () => {
  calculateTodaysRanks();
  calculateFutureRanks();
  calculateTop3Ranks();
  calculateBottom3Ranks();
  calculateAcceleratingSkills();
  calculateDecliningSkills();
};

(async () => {
  const response = await fetch(url);
  const data = await response.json();
  fetchedData = data["Skills and Capabilities"];
  calculateAllRanks();

  console.log("BASED ON THE JSON FILE, ");
  console.log(`The ranks today are: `);
  console.log(todayRanks);
  console.log(`The ranks in  future are: `);
  console.log(futureRanks);
  console.log(`The top 3 skills today are: `);
  console.log(top3TodayRanks);
  console.log(`The top 3 skills in future are: `);
  console.log(top3FutureRanks);
  console.log(`The bottom 3 skills today are: `);
  console.log(bottom3TodayRanks);
  console.log(`The bottom 3 skills in future are: `);
  console.log(bottom3FutureRanks);
  console.log(`The top 3 accelerating skills are: `);
  console.log(acceleratingSkills);
  console.log(`The top 3 decelerating skills are: `);
  console.log(decliningSkills);
})();

submitBtn.addEventListener("click", getRank);
