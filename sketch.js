/***************************************
 * Global Variables
 **************************************/
let boombot, currentBomb = null;
let activeExplosions = [];
let explosionFramesList = [];
let tiles = [];
let tileSize = 32;
let objective;
let currentLevel = 0;
let levelData = [];
let backgroundImage;
let spikeSprite;
let floorTileSprite;
let spawnX = 1, spawnY = 1; 
let tileSprites = [];
let healthSprite;


// Sound variables
let bombDropSound, explosionSound, levelWinSound, startSound;
let backgroundMusic;
// Boombot health
let boombotHealth = 200;
let gameOver = false;

// Bomb cooldown
let lastBombTime = 0;
const BOMB_COOLDOWN = 100; 

const MIN_BOMB_SCALE = 1;
const MAX_BOMB_SCALE = 2;
const MIN_FORCE = 5;
const MAX_FORCE = 50;

/***************************************
 * Preload Explosion Animations and Level Data
 **************************************/
function preload() {
  backgroundImage = loadImage("assets/Background.png");

  floorTileSprite = loadImage("assets/FloorTile.png");

  loadImage("assets/Flag.png", img => {
    img.resize(tileSize,tileSize*3);
    flagSprite = img;
  });

  loadImage("assets/Bomb.png", img => {
    img.resize(30,30);
    bombSprite = img;
  });

  loadImage("assets/Health.png", img => {
    img.resize(tileSize,tileSize);
    healthSprite = img;
  });
  
  loadImage("assets/Spike.png", img => {
    img.resize(tileSize,tileSize);
    spikeSprite = img;
  });

  loadImage("assets/Boombot.png", img => {
    img.resize(tileSize, tileSize);
    boombotSprite = img;
  });


  // Load sounds
  
  soundFormats('mp3');

  backgroundMusic = loadSound("sounds/backgroundmusic.mp3");

  bombDropSound = loadSound("sounds/bombdrop.mp3");
  explosionSound = loadSound("sounds/explosion.mp3");
  levelWinSound = loadSound("sounds/levelwin.mp3");
  startSound = loadSound("sounds/start.mp3");

  explosionFramesList.push([
    loadImage("assets/1/1.png"), loadImage("assets/1/2.png"), loadImage("assets/1/3.png"),
    loadImage("assets/1/4.png"), loadImage("assets/1/5.png"), loadImage("assets/1/6.png")
  ]);
  explosionFramesList.push([
    loadImage("assets/2/1.png"), loadImage("assets/2/2.png"), loadImage("assets/2/3.png"),
    loadImage("assets/2/4.png"), loadImage("assets/2/5.png"), loadImage("assets/2/6.png")
  ]);
  explosionFramesList.push([
    loadImage("assets/3/1.png"), loadImage("assets/3/2.png"), loadImage("assets/3/3.png"),
    loadImage("assets/3/4.png"), loadImage("assets/3/5.png")
  ]);
  explosionFramesList.push([
    loadImage("assets/4/1.png"), loadImage("assets/4/2.png"), loadImage("assets/4/3.png"),
    loadImage("assets/4/4.png"), loadImage("assets/4/5.png")
  ]);
  explosionFramesList.push([
    loadImage("assets/5/1.png"), loadImage("assets/5/2.png"), loadImage("assets/5/3.png"),
    loadImage("assets/5/4.png"), loadImage("assets/5/5.png")
  ]);

  levelData = [
    [
      "################################",
      "#..............................#",
      "#..............................#",
      "#..............................#",
      "#..............................#",
      "#.H.....................G.#....#",
      "#####.....................#....#",
      "#.............S.#.....#####....#",
      "#..........######..............#",
      "#..............................#",
      "#.....................H...#....#",
      "#...................#######....#",
      "###########....................#",
      "#........................#.....#",
      "#........................#.....#",
      "#..............###########.....#",
      "#.....#S.......................#",
      "#.....#######..............#####",
      "#.............H..........#.....#",
      "#....................#####.....#",
      "#..............................#",
      "#....#.......S.................#",
      "#....#########.................#",
      "#..............................#",
      "#.....H................#.......#",
      "#...#...............####.......#",
      "#...####.......................#",
      "#..............................#",
      "#.B............................#",
      "#..............................#",
      "################################"
    ],    
    [
      "################################",
      "#..............................#",
      "#..............................#",
      "#................######....G...#",
      "#.....................#........#",
      "#...........H.........#######..#",
      "#...........#####..............#",
      "#..............................#",
      "#....#####......######.........#",
      "#..............................#",
      "#...............H..............#",
      "#......###########.............#",
      "#.....................#........#",
      "#...............#######........#",
      "#..............#......#........#",
      "#.H............#......#........#",
      "####...........########........#",
      "#..............................#",
      "#..............................#",
      "#....#S.................S.#....#",
      "#....####............######....#",
      "#...............S.#............#",
      "#.............#####............#",
      "#.........H....................#",
      "#.....#######..............#####",
      "#..............................#",
      "#..............................#",
      "#..............S...............#",
      "#..........#########...........#",
      "#.B............................#",
      "################################"
    ],        
    [
      "################################",
      "#............G.................#",
      "#...........####...............#",
      "#...............####...........#",
      "#...................###........#",
      "#......H..................S....#",
      "#..........#############....####",
      "#..............................#",
      "######.........................#",
      "#....#......................#..#",
      "#....#####..............#####..#",
      "#..............................#",
      "#..............................#",
      "#...............H..............#",
      "#..........###########.........#",
      "#..........................S...#",
      "#####..................#########",
      "#.................. ...........#",
      "#.....#........................#",
      "#.....#..H...............#.....#",
      "#.....#####..............#.....#",
      "#....#...............#####.....#",
      "#....#.........................#",
      "#....#####..............#......#",
      "#.............H.........#......#",
      "#..#..........###########......#",
      "#..#...........................#",
      "#..#########...................#",
      "#..............................#",
      "#.B............................#",
      "################################"
    ],
    [
      "################################",
      "#..............................#",
      "#..............................#",
      "#......................G.......#",
      "#############......#############",
      "#..............................#",
      "#..............................#",
      "#..H.................S.........#",
      "######......####################",
      "#..............................#",
      "#.....H..........S.............#",
      "######################......####",
      "#..............................#",
      "#..............................#",
      "#...................H..........#",
      "####.......#####################",
      "#..............................#",
      "#..............................#",
      "#.............H................#",
      "######################......####",
      "#..............................#",
      "#..............................#",
      "#.....................H........#",
      "##########......################",
      "#..............................#",
      "#..............................#",
      "#..........H...................#",
      "#######################......###",
      "#..............................#",
      "#.B............................#",
      "#..............................#",
      "################################"
    ]
  ];

  levelData = [
    levelData[3],   // Level 1 (unchanged)
    levelData[2],   // ← Move level 4 here
    levelData[0],   // ← Former level 2 becomes 3
    levelData[1],   // ← Former level 3 becomes 4
  ];
  
}

/***************************************
 * Setup Game
 **************************************/
function setup() {
  userStartAudio(); // ← required to enable audio playback

  if (!backgroundMusic.isPlaying()) {
    backgroundMusic.setVolume(0.5); // Optional: control volume (0 to 1)
    backgroundMusic.loop();
  }

  createCanvas(backgroundImage.width, backgroundImage.height);
  world.gravity.y = 12;
  loadLevel(currentLevel);
  floorTileSprite.resize(tileSize, tileSize);
  startSound.play();
}

let spikes = [];
let healthBlocks = [];

function loadLevel(index) {

  clear();           
  clearSprites();    
  tiles = [];
  spikes = [];
  healthBlocks = [];
  boombotHealth = 200;

  
  let rows = levelData[index];

  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      let char = rows[y][x];
      let px = x * tileSize + tileSize / 2;
      let py = y * tileSize + tileSize / 2;
      
      if (char === '#') {
        let tile = new Sprite();
        tile.x = px;
        tile.y = py;
        tile.w = tileSize;
        tile.h = tileSize;
        tile.collider = 'static';
        tile.image = floorTileSprite;
        tiles.push(tile);
        
      } else if (char === 'G') {
        objective = createSprite(px, py, tileSize, tileSize * 3);
        objective.image = flagSprite;
        
      } else if (char === 'B') {
        spawnX = x;
        spawnY = y;
        
      } else if (char === 'S') {  // <-- SPIKE tile
        let spike = createSprite(px, py, tileSize, tileSize / 2);
        spike.collider = 'static';
        spike.color = 'red';
        spike.image = spikeSprite;
        spikes.push(spike);

      } else if (char === 'H') {  // <-- HEALTH BLOCK tile
        let healthBlock = createSprite(px, py, tileSize, tileSize);
        healthBlock.collider = 'static';
        healthBlock.image = healthSprite;
        healthBlocks.push(healthBlock);
      }
    }
  }

  let spawnPx = spawnX * tileSize + tileSize / 2;
  let spawnPy = spawnY * tileSize + tileSize / 2;
  boombot = createSprite(spawnPx, spawnPy, tileSize, tileSize);
  boombot.shape = 'circle';
  boombot.friction = 3;
  boombot.bounciness = 0.3;
  boombot.rotationdrag = 2;
  boombot.drag = 2;
  boombot.rotationLock = false;
  boombot.mass = 80;
  boombot.image = boombotSprite;
}


/***************************************
 * Draw Loop
 **************************************/
function draw() {
  if (backgroundImage) {
    imageMode(CORNER);
    image(backgroundImage, 0, 0, width, height);
  } else {
    background("slategrey");
  }

  if (gameOver) {
    textAlign(CENTER, CENTER);
    textSize(64);
    fill(255, 0, 0);
    text("Game Over", width / 2, height / 2);
    noLoop();
    return;
  }
  
  // Health bar display
  fill(0);
  fill(0, 255, 0);
  rect(50, 50, map(boombotHealth, 0, 100, 0, 200), 20); // green health
  fill(255);
  noStroke();
  textSize(12);
  textAlign(LEFT);
  text("Health: " + floor(boombotHealth), 260, 65);
  

  if (currentBomb !== null && mouseIsPressed) {
    if (currentBomb.scaleDirection === undefined) {
      currentBomb.scaleDirection = 1;
    }

    let increment = 0.02;
    let scaleChange = increment * currentBomb.scaleDirection;
    let newScale = currentBomb.scale + scaleChange;

    if (newScale >= MAX_BOMB_SCALE) {
      newScale = MAX_BOMB_SCALE;
      currentBomb.scaleDirection = -1;
    } else if (newScale <= MIN_BOMB_SCALE) {
      newScale = MIN_BOMB_SCALE;
      currentBomb.scaleDirection = 1;
    }

    currentBomb.scale = newScale;
  }

  for (let i = activeExplosions.length - 1; i >= 0; i--) {
    let ex = activeExplosions[i];
    imageMode(CENTER);
    let img = ex.frames[ex.currentFrame];
    if (img) image(img, ex.x, ex.y, img.width * ex.scale, img.height * ex.scale);
    ex.tick++;
    if (ex.tick >= ex.frameDelay) {
      ex.tick = 0;
      ex.currentFrame++;
      if (ex.currentFrame >= ex.frames.length) {
        activeExplosions.splice(i, 1);
      }
    }
  }
  imageMode(CORNER);

  if (boombot.overlap(objective)) {
    levelWinSound.play();
    currentLevel++;
    if (currentLevel < levelData.length) {
      loadLevel(currentLevel);
    } else {
      noLoop();
      textAlign(CENTER, CENTER);
      textSize(64);
      fill(255);
      text("You Win!", width / 2, height / 2);
    }
  }

  // Check collision with spikes
  for (let i = spikes.length - 1; i >= 0; i--) {
    if (boombot.overlap(spikes[i])) {
      boombotHealth -= 25;
      spikes[i].remove();
      spikes.splice(i, 1); // remove from array
      if (boombotHealth <= 0) {
        boombotHealth = 0;
        gameOver = true;
      }
    }
  }
  
  // Check collision with health blocks
  for (let i = healthBlocks.length - 1; i >= 0; i--) {
    if (boombot.overlap(healthBlocks[i])) {
      boombotHealth = min(boombotHealth + 50, 200); 
      healthBlocks[i].remove();
      healthBlocks.splice(i, 1);
    }
  }

  drawSprites();
}

function mousePressed() {
  if (currentBomb === null && millis() - lastBombTime > BOMB_COOLDOWN) {
    bombDropSound.play();
    currentBomb = createSprite(mouseX, mouseY, 30, 30);
    currentBomb.shape = 'circle';
    currentBomb.collider = 'none'; // <--- disables gravity + collisions
    currentBomb.scale = MIN_BOMB_SCALE;
    currentBomb.scaleDirection = 1;
    currentBomb.image = bombSprite;
    lastBombTime = millis();
  }
}



function mouseReleased() {
  if (currentBomb !== null) {
    let bombToExplode = currentBomb;
    currentBomb = null;
    setTimeout(() => explosion(bombToExplode), 1);
  }
}

function explosion(bomb) {
  explosionSound.play();
  let explosionCenter = bomb.position.copy();
  let explosionRadius = 500 * (bomb.scale / MAX_BOMB_SCALE);
  let forceMultiplier = map(bomb.scale, MIN_BOMB_SCALE, MAX_BOMB_SCALE, MIN_FORCE, MAX_FORCE);
  let forceMagnitude = 0;

  let d = dist(boombot.position.x, boombot.position.y, explosionCenter.x, explosionCenter.y);
  if (d < explosionRadius) {
    forceMagnitude = forceMultiplier * (1 - d / explosionRadius);
    let dx = boombot.position.x - explosionCenter.x;
    let dy = boombot.position.y - explosionCenter.y;
    let norm = sqrt(dx * dx + dy * dy);
    if (norm !== 0) {
      dx /= norm;
      dy /= norm;
    }
    boombot.velocity.x += dx * forceMagnitude;
    boombot.velocity.y += dy * forceMagnitude;
  }



  let frames = random(explosionFramesList);
  let explosionObj = {
    x: explosionCenter.x,
    y: explosionCenter.y,
    scale: constrain(bomb.scale * 1.5, 0.5, 3),
    frames: frames,
    currentFrame: 0,
    frameDelay: 5,
    tick: 0
  };
  activeExplosions.push(explosionObj);
  bomb.remove();

  let damage = constrain(forceMagnitude * .5, 0, 100);
  boombotHealth -= damage;
  if (boombotHealth <= 0) {
    boombotHealth = 0;
    gameOver = true;
  }

}


function clearSprites() {
  for (let i = allSprites.length - 1; i >= 0; i--) {
    allSprites[i].remove();
  }
}
