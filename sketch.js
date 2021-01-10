// variable defining
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var randomint;
var cloud, cloudImage;
var obstacle, obs1, obs2, obs3, obs4, obs5, obs6;
var score, highscore, restartCount;
var obstacleGroup, cloudGroup;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOverImg, restartImg, gameOver, restart;
var death, checkPoint, jump;

// loading images
function preload() {

  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obs1 = loadImage("obstacle1.png");
  obs2 = loadImage("obstacle2.png");
  obs3 = loadImage("obstacle3.png");
  obs4 = loadImage("obstacle4.png");
  obs5 = loadImage("obstacle5.png");
  obs6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jump = loadSound("jump.mp3");
  checkPoint = loadSound("checkPoint.mp3");
  death = loadSound("die.mp3");
  
}

// game objects
function setup() {
  
  createCanvas(600, 200);

  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.setCollider("circle", 0, 0, 40);
  //trex.debug = true;
  
  //create a ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width / 2;
  
  // removes the gap between trex and ground
  invisibleGround = createSprite(200, 190, 400, 20);
  invisibleGround.visible = false;
  
  // warn, error, and info testing
  //console.error("error");
  //console.warn("warning");
  //console.info("info");
  
  // score
  score = 0;
  highscore = 0;
  restartCount = 0;
  
  // game over and restart buttons
  gameOver = createSprite(300, 100);
  restart = createSprite(300, 140);
  gameOver.addImage("gameover", gameOverImg);
  restart.addImage("restart", restartImg);
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  // groups
  obstacleGroup = new Group();
  cloudGroup = new Group();
  
}

// function to make cloud
function spawnCloud() {
  
  if (frameCount % 60 === 0) {
    
    cloud = createSprite(600, 100, 40, 10);
    cloud.addImage("cloud", cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    cloud.y = Math.round(random(10, 90));
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.lifetime = 220;
    cloudGroup.add(cloud);
    
  }
  
}

// to spawn obstacles
function obstacleMake() {
  
  if (frameCount % 80 === 0) {
    
    obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -(6 + score / 100);
    
    // generates a random number for obstacle creation
    var obschoose = Math.round(random(1, 6));
    
    switch(obschoose) {
        
      case 1: obstacle.addImage(obs1); obstacle.scale = 0.1;
      break;
      
      case 2: obstacle.addImage(obs2); obstacle.scale = 0.1;
      break;
      
      case 3: obstacle.addImage(obs3); obstacle.scale = 0.12;
      break;
      
      case 4: obstacle.addImage(obs4); obstacle.scale = 0.05;
      break;
      
      case 5: obstacle.addImage(obs5); obstacle.scale = 0.05;
      break;
      
      case 6: obstacle.addImage(obs6); obstacle.scale = 0.12;
      break;
      
      default:
      break;
      
    }
    
    obstacle.lifetime = 250; 
    obstacleGroup.add(obstacle);
    
  }
  
}

// restart function
function restartGame() {
  
  gameState = PLAY;
  restart.visible = false;
  gameOver.visible = false;
  
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
}

function draw() {
  
  // background reset
  background(200);
  
  // printing score and highscore
  text("Score:" + score, 500, 50);
  text("High Score:" + highscore, 500, 70);
  
  // gamestate logic
  if (gameState === PLAY) {
    
    gameOver.visible = false;
    restart.visible = false;
    
    // ground moves if you are playing
    ground.velocityX = -(4 + score / 150);
    
    // scoring logic
    score = score + Math.round(getFrameRate() / 60);
    
    // sound plays every 100 points
    if (score % 100 === 0 && score > 0) {
      
      checkPoint.play();
      
    }
    
    //jump when the space button is pressed
    if (keyDown("space") && trex.y >= 150) {
    
      trex.velocityY = -10;
      jump.play();
      
    }
     
    
    // gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    // looping ground
    if (ground.x < 0) {
    
      ground.x = ground.width / 2;
    
    }
    
    // create a cloud sprite
    spawnCloud();
  
    // create obstacles
    obstacleMake();
    
    if (obstacleGroup.isTouching(trex)) {
      
      death.play();
      gameState = END;
      
    }
        
  }
  
  else if (gameState === END) {
    
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("collided", trex_collided);
    
    // check if you pressed restart
    if (mousePressedOver(restart)) {
    
      restartGame();
      
      restartCount = restartCount + 1;
      
      if (highscore < score) {
        
        highscore = score;
        
      }
      
      if (restartCount === 3)  {
        
        score = 0;
        highscore = 0;
        restartCount = 0;
        
      }
      
      score = 0;
      
    }
    
    // setting lifetime to solve disappearing objects
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    
  }
  
  // trex collides with ground
  trex.collide(invisibleGround);
  
  // drawing the sprites
  drawSprites();
  
}