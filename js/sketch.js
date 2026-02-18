var tileSize = 50;
var xoff = 145;
var yoff = 100;

var humanPlaying = false;
var left = false;
var right = false;
var up = false;
var down = false;
var p;

var tiles = [];
var solids = [];
var dots = [];
var savedDots = [];

var showBest = true;

var winArea;

var replayGens = false;
var genPlayer;
var upToGenPos = 0;

var numberOfSteps = 10;
var testPopulation;

var winCounter = -1;

var img;
var flip = true;

var populationSize = 500;
var popPara;
var popSlider;

var mutationRate = 0.04;
var mrPara;
var mrSlider;

var evolutionSpeed = 1;
var speedPara;
var speedSlider;

var movesH3;

var increaseMovesBy = 5;
var movesPara;
var movesSlider;

var increaseEvery = 5;
var everyPara;
var everySlider;

function setup() {
  var canvas = createCanvas(1200, 640);
  canvas.style("display", "block");
  canvas.style("margin-left", "auto");
  canvas.style("margin-right", "auto");
  textFont("Arial");
  htmlStuff();
  for (var i = 0; i < 22; i++) {
    tiles[i] = [];
    for (var j = 0; j < 10; j++) {
      tiles[i][j] = new Tile(i, j);
    }
  }

  setLevel1Walls();
  setLevel1Goal();
  setLevel1SafeArea();
  setEdges();
  setSolids();

  p = new Player();
  setDots();
  winArea = new Solid(tiles[17][1], tiles[20][2]);
  testPopulation = new Population(populationSize);
  img = loadImage("https://i.imgur.com/QZf0d6r.gif");

  window.addEventListener(
    "keydown",
    function (e) {
      if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
      }
    },
    false,
  );
}
var showedCoin = false;
function draw() {
  showedCoin = false;
  background(255, 255, 255);
  drawTiles();
  writeShit();

  if (humanPlaying) {
    if ((p.dead && p.fadeCounter <= 0) || p.reachedGoal) {
      if (p.reachedGoal) {
        winCounter = 100;
      }
      p = new Player();
      p.human = true;
      resetDots();
    } else {
      moveAndShowDots();

      p.update();
      p.show();
    }
  } else if (replayGens) {
    if (
      (genPlayer.dead && genPlayer.fadeCounter <= 0) ||
      genPlayer.reachedGoal
    ) {
      upToGenPos++;
      if (testPopulation.genPlayers.length <= upToGenPos) {
        upToGenPos = 0;
        replayGens = false;

        loadDots();
      } else {
        genPlayer = testPopulation.genPlayers[upToGenPos].gimmeBaby();
        resetDots();
      }
    } else {
      moveAndShowDots();
      genPlayer.update();
      genPlayer.show();
    }
  } else if (testPopulation.allPlayersDead()) {
    testPopulation.calculateFitness();
    testPopulation.naturalSelection();
    testPopulation.mutateDemBabies();
    resetDots();

    if (testPopulation.gen % increaseEvery == 0) {
      testPopulation.increaseMoves();
    }
  } else {
    for (var j = 0; j < evolutionSpeed; j++) {
      for (var i = 0; i < dots.length; i++) {
        dots[i].move();
      }
      testPopulation.update();
    }

    for (var i = 0; i < dots.length; i++) {
      dots[i].show();
    }
    testPopulation.show();
  }
}
function moveAndShowDots() {
  for (var i = 0; i < dots.length; i++) {
    dots[i].move();
    dots[i].show();
  }
}
function resetDots() {
  for (var i = 0; i < dots.length; i++) {
    dots[i].resetDot();
  }
}
function drawTiles() {
  for (var i = 0; i < tiles.length; i++) {
    for (var j = 0; j < tiles[0].length; j++) {
      tiles[i][j].show();
    }
  }
  for (var i = 0; i < tiles.length; i++) {
    for (var j = 0; j < tiles[0].length; j++) {
      tiles[i][j].showEdges();
    }
  }
}

function loadDots() {
  for (var i = 0; i < dots.length; i++) {
    dots[i] = savedDots[i].clone();
  }
}

function saveDots() {
  for (var i = 0; i < dots.length; i++) {
    savedDots[i] = dots[i].clone();
  }
}

function writeShit() {
  fill(0, 0, 0);
  textSize(18);
  noStroke();
  text("Press SPACE to view all agents in the current generation.", 440, 590)
    .fo;
  text(
    " \tPress P to play manually. \t\t\t Press G to replay best generations.",
    370,
    620,
  );
  textSize(20);
  if (winCounter > 0) {
    if (flip) {
      push();

      scale(-1.0, 1.0);
      image(img, -300 - img.width + random(5), 100 + random(5));
      pop();
    } else {
      image(img, 300 + random(5), 100 + random(5));
    }
    textSize(100);
    stroke(0);

    winCounter--;
    if (winCounter % 10 == 0) {
      flip = !flip;
    }
    textSize(36);
    noStroke();
  }
  if (replayGens) {
    text("Generation: " + genPlayer.gen, 240, 120);
    text("Number of Moves: " + genPlayer.brain.directions.length, 950, 120);
  } else if (!humanPlaying) {
    text("Generation: " + testPopulation.gen, 240, 120);
    if (testPopulation.solutionFound) {
      text("Wins in " + testPopulation.minStep + " moves", 950, 120);
    } else {
      text(
        "Number of Moves: " + testPopulation.players[0].brain.directions.length,
        950,
        120,
      );
    }
  } else {
    text("Solo Gameplay", 620, 130);
  }
}
function keyPressed() {
  if (humanPlaying) {
    switch (keyCode) {
      case UP_ARROW:
        up = true;
        break;
      case DOWN_ARROW:
        down = true;
        break;
      case RIGHT_ARROW:
        right = true;
        break;
      case LEFT_ARROW:
        left = true;
        break;
    }
    switch (key) {
      case "W":
        up = true;
        break;
      case "S":
        down = true;
        break;
      case "D":
        right = true;
        break;
      case "A":
        left = true;
        break;
    }
    setPlayerVelocity();
  } else {
    switch (key) {
      case " ":
        showBest = !showBest;
        break;
      case "G":
        if (replayGens) {
          upToGenPos = 0;
          replayGens = false;
          loadDots();
        } else if (testPopulation.genPlayers.length > 0) {
          replayGens = true;
          genPlayer = testPopulation.genPlayers[0].gimmeBaby();
          saveDots();
          resetDots();
        }
        break;
    }
  }

  if (key == "P") {
    if (humanPlaying) {
      humanPlaying = false;
      loadDots();
    } else {
      if (replayGens) {
        upToGenPos = 0;
        replayGens = false;
      }
      humanPlaying = true;
      p = new Player();
      p.human = true;
      saveDots();
      resetDots();
    }
  }
}

function keyReleased() {
  if (humanPlaying) {
    switch (keyCode) {
      case UP_ARROW:
        up = false;
        break;
      case DOWN_ARROW:
        down = false;
        break;
      case RIGHT_ARROW:
        right = false;
        break;
      case LEFT_ARROW:
        left = false;
        break;
    }
    switch (key) {
      case "W":
        up = false;
        break;
      case "S":
        down = false;
        break;
      case "D":
        right = false;
        break;
      case "A":
        left = false;
        break;
    }

    setPlayerVelocity();
  }
}

function setPlayerVelocity() {
  p.vel.y = 0;
  if (up) {
    p.vel.y -= 1;
  }
  if (down) {
    p.vel.y += 1;
  }
  p.vel.x = 0;
  if (left) {
    p.vel.x -= 1;
  }
  if (right) {
    p.vel.x += 1;
  }
}

function htmlStuff() {
  var controlPanel = createDiv("");
  controlPanel.id("control-panel");
  controlPanel.style("position", "fixed");
  controlPanel.style("left", "50%");
  controlPanel.style("top", "220px");
  controlPanel.style("transform", "translateX(-620px)");
  controlPanel.style("width", "180px");
  controlPanel.style("padding", "20px");
  controlPanel.style("background-color", "#f5f5f5");
  controlPanel.style("border", "1px solid #ddd");
  controlPanel.style("border-radius", "8px");
  controlPanel.style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)");

  var title = createElement("h3", "Evolution Controls");
  title.parent(controlPanel);
  title.style("margin-top", "0");
  title.style("margin-bottom", "15px");
  title.style("font-size", "18px");

  var popContainer = createDiv("");
  popContainer.parent(controlPanel);
  popContainer.style("margin-bottom", "15px");

  var popLabelContainer = createDiv("");
  popLabelContainer.parent(popContainer);
  popLabelContainer.style("display", "flex");
  popLabelContainer.style("justify-content", "space-between");
  popLabelContainer.style("align-items", "center");
  popLabelContainer.style("margin-bottom", "5px");

  var popLabel = createDiv("Population Size");
  popLabel.parent(popLabelContainer);
  popLabel.style("font-weight", "bold");

  popPara = createDiv(populationSize.toString());
  popPara.parent(popLabelContainer);

  popSlider = createSlider(100, 10000, populationSize, 100);
  popSlider.parent(popContainer);
  popSlider.style("width", "100%");
  popSlider.input(updatePopSize);

  var mrContainer = createDiv("");
  mrContainer.parent(controlPanel);
  mrContainer.style("margin-bottom", "15px");

  var mrLabelContainer = createDiv("");
  mrLabelContainer.parent(mrContainer);
  mrLabelContainer.style("display", "flex");
  mrLabelContainer.style("justify-content", "space-between");
  mrLabelContainer.style("align-items", "center");
  mrLabelContainer.style("margin-bottom", "5px");

  var mrLabel = createDiv("Mutation Rate");
  mrLabel.parent(mrLabelContainer);
  mrLabel.style("font-weight", "bold");

  mrPara = createDiv(mutationRate.toFixed(4));
  mrPara.parent(mrLabelContainer);

  mrSlider = createSlider(0.0001, 0.5, mutationRate, 0.0001);
  mrSlider.parent(mrContainer);
  mrSlider.style("width", "100%");
  mrSlider.input(updateMutationRate);

  var speedContainer = createDiv("");
  speedContainer.parent(controlPanel);
  speedContainer.style("margin-bottom", "15px");

  var speedLabelContainer = createDiv("");
  speedLabelContainer.parent(speedContainer);
  speedLabelContainer.style("display", "flex");
  speedLabelContainer.style("justify-content", "space-between");
  speedLabelContainer.style("align-items", "center");
  speedLabelContainer.style("margin-bottom", "5px");

  var speedLabel = createDiv("Evolution Speed");
  speedLabel.parent(speedLabelContainer);
  speedLabel.style("font-weight", "bold");

  speedPara = createDiv(evolutionSpeed.toString());
  speedPara.parent(speedLabelContainer);

  speedSlider = createSlider(1, 10, evolutionSpeed, 1);
  speedSlider.parent(speedContainer);
  speedSlider.style("width", "100%");
  speedSlider.input(updateSpeed);

  var divider = createDiv("");
  divider.parent(controlPanel);
  divider.style("border-top", "1px solid #ddd");
  divider.style("margin", "15px 0");

  var movesTitle = createDiv("Move Increment");
  movesTitle.parent(controlPanel);
  movesTitle.style("font-weight", "bold");
  movesTitle.style("margin-bottom", "10px");
  movesTitle.style("font-size", "14px");

  var movesContainer = createDiv("");
  movesContainer.parent(controlPanel);
  movesContainer.style("margin-bottom", "15px");

  var movesLabelContainer = createDiv("");
  movesLabelContainer.parent(movesContainer);
  movesLabelContainer.style("display", "flex");
  movesLabelContainer.style("justify-content", "space-between");
  movesLabelContainer.style("align-items", "center");
  movesLabelContainer.style("margin-bottom", "5px");

  var movesLabel = createDiv("Increase Moves By");
  movesLabel.parent(movesLabelContainer);
  movesLabel.style("font-weight", "bold");
  movesLabel.style("font-size", "13px");

  movesPara = createDiv(increaseMovesBy.toString());
  movesPara.parent(movesLabelContainer);
  movesPara.style("font-size", "13px");

  movesSlider = createSlider(1, 100, increaseMovesBy, 1);
  movesSlider.parent(movesContainer);
  movesSlider.style("width", "100%");
  movesSlider.input(updateMoves);

  var everyContainer = createDiv("");
  everyContainer.parent(controlPanel);
  everyContainer.style("margin-bottom", "0");

  var everyLabelContainer = createDiv("");
  everyLabelContainer.parent(everyContainer);
  everyLabelContainer.style("display", "flex");
  everyLabelContainer.style("justify-content", "space-between");
  everyLabelContainer.style("align-items", "center");
  everyLabelContainer.style("margin-bottom", "5px");

  var everyLabel = createDiv("Every N Generations");
  everyLabel.parent(everyLabelContainer);
  everyLabel.style("font-weight", "bold");
  everyLabel.style("font-size", "13px");

  everyPara = createDiv(increaseEvery.toString());
  everyPara.parent(everyLabelContainer);
  everyPara.style("font-size", "13px");

  everySlider = createSlider(1, 100, increaseEvery, 1);
  everySlider.parent(everyContainer);
  everySlider.style("width", "100%");
  everySlider.input(updateEvery);

  // Set initial fill on all sliders
  updateSliderFill(popSlider);
  updateSliderFill(mrSlider);
  updateSliderFill(speedSlider);
  updateSliderFill(movesSlider);
  updateSliderFill(everySlider);
}

function updateSliderFill(slider) {
  var el = slider.elt;
  var min = parseFloat(el.min);
  var max = parseFloat(el.max);
  var val = parseFloat(el.value);
  var percent = ((val - min) / (max - min)) * 100;
  el.style.backgroundImage =
    "linear-gradient(to right, #007aff 0%, #007aff " +
    percent +
    "%, #d1d1d6 " +
    percent +
    "%, #d1d1d6 100%)";
}

function updatePopSize() {
  populationSize = popSlider.value();
  popPara.html(populationSize.toString());
  updateSliderFill(popSlider);
}

function updateMutationRate() {
  mutationRate = mrSlider.value();
  mrPara.html(mutationRate.toFixed(4));
  updateSliderFill(mrSlider);
}

function updateSpeed() {
  evolutionSpeed = speedSlider.value();
  speedPara.html(evolutionSpeed.toString());
  updateSliderFill(speedSlider);
}

function updateMoves() {
  increaseMovesBy = movesSlider.value();
  movesPara.html(increaseMovesBy.toString());
  updateSliderFill(movesSlider);
}

function updateEvery() {
  increaseEvery = everySlider.value();
  everyPara.html(increaseEvery.toString());
  updateSliderFill(everySlider);
}
