const holes = document.querySelectorAll(".hole")
const moles = document.querySelectorAll(".mole")
const scoreBoard = document.querySelector(".score")
const startBtn = document.querySelector(".start-btn")
const levels  = document.querySelector(".levels")
const game  = document.querySelector(".game")
const easyHighScoreBoard = document.getElementById("easy-score");
const mediumHighScoreBoard = document.getElementById("medium-score");
const hardHighScoreBoard = document.getElementById("hard-score");

let lastHole;
let timeUp =  false;
let score=0;

function difficultyLevel(){
    const ele = document.getElementsByName("level");
    for(let i=0;i<ele.length;i++){
        if(ele[i].checked){
            return ele[i].id
        }
    }
}
function randomTime(min,max){
    return Math.round(Math.random()*(max-min)+min)
}
function randomHole(holes){
    const id =Math.floor(Math.random()*holes.length)
    const hole = holes[id]
    if(hole=== lastHole){
        return randomHole(holes)
    }
    lastHole=hole;
    return hole;
}
function peep(show,hide){
    const time = randomTime(show,hide);
    const hole=randomHole(holes);
    hole.classList.add("up")

    setTimeout(()=>{
        hole.classList.remove("up")
        if(!timeUp){
            peep(show,hide)
        }
    },time)
}

function startGame(){
    let show ,hide ;
    const difficulty = difficultyLevel();
    if(difficulty === "easy"){
        show=500;
        hide=1500;
    }else if (difficulty === "medium"){
        show=300;
        hide=1200;
    }else{
        show=150;
        hide=900;
    }
    scoreBoard.textContent = 0;
    timeUp=false;
    startBtn.innerHTML = "PLAY...🎮"
    startBtn.disabled=true;
    levels.style.visibility = "hidden"
    score=0;

    peep(show,hide);

    setTimeout(()=>{
        timeUp=true;
        startBtn.innerHTML = "Restart";
        startBtn.disabled = false;
        startBtn.style.visibility="visible"
        levels.style.visibility = "visible";
        if (score > highScores[difficulty]) {
            highScores[difficulty] = score;
            updateHighScores();
        }

    },15000)
}


function updateHighScores() {
    easyHighScoreBoard.textContent = highScores.easy;
    mediumHighScoreBoard.textContent = highScores.medium;
    hardHighScoreBoard.textContent = highScores.hard;
}

function bonk(e) {
    if (!e.isTrusted) return; // cheater!
    score++;
    this.parentNode.classList.remove("up");
    scoreBoard.textContent = score;
}


function hitTheMole(e){
    if(!e.isTrusted){
        return
    }
    score++;
    this.parentNode.classList.remove("up")
    scoreBoard.textContent=score
}
moles.forEach((mole)=>{
    mole.addEventListener('click',hitTheMole)
})
