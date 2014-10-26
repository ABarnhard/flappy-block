var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv'),
    mainState = {
      preload:preload,
      create:create,
      update:update,
      jump:jump,
      restartGame:restartGame,
      addOnePipe:addOnePipe,
      addPipeRow:addPipeRow
    },
    spaceKey;

function preload(){
  game.stage.backgroundColor = '#71c5cf';
  game.load.spritesheet('block', '/assets/sprite.png', 24, 24);
  game.load.spritesheet('pipe', '/assets/pipes.png', 52, 320);
}

function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  this.block = this.game.add.sprite(100, 254, 'block');

  game.physics.arcade.enable(this.block);
  this.block.body.gravity.y = 1000;

  spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  spaceKey.onDown.add(this.jump, this);

  this.block.animations.add('flap', [1, 2, 3], 20, false);
  this.block.anchor.setTo(-0.2, 0.5);

  this.pipes = game.add.group();
  this.pipes.enableBody = true;
  this.pipes.createMultiple(6, 'pipe');

  this.timer = game.time.events.loop(1500, this.addPipeRow, this);

  this.score = 0;
  this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });

}

function update(){
  if(this.block.inWorld == false){
    this.restartGame();
  }
  if(this.block.angle < 20){
    this.block.angle += 1;
  }

  game.physics.arcade.overlap(this.block, this.pipes, this.restartGame, null, this);
}

function jump(){
  this.block.animations.play('flap');
  game.add.tween(this.block).to({angle: -20}, 100).start();
  this.block.body.velocity.y = -350;
}

function restartGame(){
  game.state.start('main');
}

function addOnePipe(x, y, pos){
  var pipe = this.pipes.getFirstDead();
  pipe.frame = pos;
  pipe.reset(x, y);
  pipe.body.velocity.x = -200;
  pipe.checkWorldBounds = true;
  pipe.outOfBoundsKill = true;
};

function addPipeRow(){
  var hole = Math.floor(Math.random() * (320 - 170 + 1)) + 170,
      x    = 400,
      y;

  y = -1 * (320 - hole);
  this.addOnePipe(x, y, 0);
  y = y + 320 + 65;
  this.addOnePipe(x, y, 1);
  this.score += 1;
  this.labelScore.text = this.score;
}

game.state.add('main', mainState);
game.state.start('main');
