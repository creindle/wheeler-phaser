//This sets the variable for the spacebar.
var spaceKey;

var ground;
var player;
var obstacle;
var obstacle2;

//This sets the score to start at -1
var score = -1;

var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;
var GAME_CONTAINER_ID = 'gameDiv';
var INITIAL_MOVESPEED = 10;

//Create randomized integer variables
var bottomWallSize = (Math.random() * (1.200 - 0.0200) + 0.0200).toFixed(4);
var topWallSize = 1.3 - bottomWallSize;
var topWallLocation = 600 - topWallSize;

//This is the object which runs the game.
function preload(){

  game.load.image('background', 'assets/background.png');
  game.load.image('player', 'assets/prehistoric_isle_3_in_1942_player_1_plane_by_theprinceofmars-d8nc9i1 copy.png');
  game.load.image('ground', 'assets/wallHorizontal.png');
  game.load.image('obstacle', 'assets/wallVertical.png');
};

function create(){

  //Set Physics Engine
  game.physics.startSystem(Phaser.Physics.ARCADE);

  ///////////////////////////////
  /// ADDS BACKGROUND IMAGE ////
  //////////////////////////////
  game.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'background');

  //Sets background color
  game.stage.backgroundColor = '#3498db';

  //Player
  player = game.add.sprite(GAME_WIDTH/8, GAME_HEIGHT*(7/8), 'player');
  player.moveSpeed = INITIAL_MOVESPEED;
   game.physics.arcade.enable(player);

   //Spacebar input for the game
   spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

   //Player physics for gravity
   player.body.bounce.y = 0.2;
   player.body.gravity.y = 600;

  //Creates the first obstacle on the screen
  obstacle = game.add.sprite(700, GAME_HEIGHT, 'obstacle');
  obstacle.scale.setTo(1, bottomWallSize);
  obstacle.anchor.setTo(0,1);
  game.physics.arcade.enable(obstacle);
  obstacle.body.immovable = true;

  /////////////////////////////////////////////////////
  /// CREATE A SECOND OBSTACLE ON THE TOP OF SCREEN ///
  /////////////////////////////////////////////////////
  obstacle2 = game.add.sprite(700, 0, 'obstacle');
  obstacle2.scale.setTo(1, topWallSize);
  obstacle2.anchor.setTo(0, 0);
  game.physics.arcade.enable(obstacle2);
  obstacle2.body.immovable = true;

  //Sets up a grou pto call platforms so that we can all horizontal surfaces to this group
  platforms = game.add.group();
  platforms.enableBody = true;

  //Creates the ground which is a solid object that the player will not pass through
  ground = platforms.create(0, GAME_HEIGHT, 'ground');
  ground.anchor.setTo(0, 1);
  ground.scale.setTo(4, 1);
  game.physics.arcade.enable(ground);
  ground.body.immovable = true;

  //Adds scoreboard on top left of screen.
  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

};

function update(){

  //Where game engine will recognizes collision with player, ground, and obstacles
  game.physics.arcade.collide(player, ground);
  game.physics.arcade.collide(player, obstacle);
  game.physics.arcade.collide(player, obstacle2);

  //Moves the obstacle to the left if it is on the right side of the screen
  if (obstacle.x > 600){
    obstacle.x -= 0.05;
  };

  if (obstacle2.x > 600) {
    obstacle2.x -= 0.05;
  }

  //Create a new wall if old wall goes off screen
  if (obstacle.x < 0){
    obstacle.kill();
    obstacle = game.add.sprite(900, GAME_HEIGHT, 'obstacle');
    obstacle.scale.setTo(1, bottomWallSize);
    obstacle.anchor.setTo(0,1);
    game.physics.arcade.enable(obstacle);
    obstacle.body.immovable = true;

    obstacle2 = game.add.sprite(900, 0, 'obstacle');
    obstacle2.scale.setTo(1, topWallSize);
    obstacle2.anchor.setTo(0, 0);
    game.physics.arcade.enable(obstacle2);
    obstacle2.body.immovable = true;


  };

  //Update score if player has not been pushed off the screen
  if (obstacle.x < 5 && player.x > 5){
    score++;
    scoreText.text = 'score: ' + score;
  };

  //This will say "You Lose!" if player is pushed off the screen
  if (player.x < 0){
    scareText = game.add.text(350, 200, 'YOU LOSE!', {FILL: '#FF0000'});
    obstacle.kill();
    obstacle2.kill();
    player.kill();
  }

  //Allows player to jump only if you press spacebar
  if (spaceKey.isDown){
    player.body.velocity.y = -300;
  }
};

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv', { preload: preload, update: update, create: create });

game.state.start();
