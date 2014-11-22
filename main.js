var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv'),
    mainState = {
      preload:preload,
      create:create,
      update:update,
      jump:jump,
      restartGame:restartGame,
      addOnePipe:addOnePipe,
      addPipeRow:addPipeRow,
      hitPipe: hitPipe
    },
    spaceKey;

function preload(){
  game.stage.backgroundColor = '#71c5cf';
  game.load.spritesheet('block', 'assets/sprite.png', 24, 24);
  game.load.spritesheet('pipe', 'assets/pipes.png', 52, 320);
  game.load.spritesheet('boom', 'assets/explosion.png', 40, 40);
  game.load.audio('bgsound', ['assets/audio/oedipus_wizball_highscore.mp3', 'assets/audio/oedipus_wizball_highscore.ogg']);
}

function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  this.block = this.game.add.sprite(100, 254, 'block');

  game.physics.arcade.enable(this.block);
  this.block.body.gravity.y = 1000;

  spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  spaceKey.onDown.add(this.jump, this);

  this.block.animations.add('flap', [1, 2, 3, 0], 15, false);
  this.block.anchor.setTo(-0.2, 0.5);

  this.pipes = game.add.group();
  this.pipes.enableBody = true;
  this.pipes.createMultiple(6, 'pipe');

  this.pipeTimer = game.time.events.loop(1500, this.addPipeRow, this);

  this.boom = this.game.add.sprite(0, 0,'boom');
  this.boom.scale.setTo(2);
  this.boom.exists = false;
  var anim = this.boom.animations.add('boom', [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11], 15, false);
  anim.onComplete.add(this.restartGame);

  this.score = 0;
  this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
  this.scorePipe = null;

  this.bgMusic = game.add.audio('bgsound');
  this.bgMusic.play();
}

function update(){
  if(this.block.inWorld == false){
    this.restartGame();
  }
  if(this.block.angle < 20){
    this.block.angle += 1;
  }

  game.physics.arcade.overlap(this.block, this.pipes, this.hitPipe, null, this);

  if(!this.scorePipe){
    this.scorePipe = this.pipes.getFirstAlive();
  }

  if(this.scorePipe){
    if(this.scorePipe.x + 52 <= 100){
      this.pipes.next();
      this.scorePipe = this.pipes.next();
      this.score += 1;
      this.labelScore.text = this.score;
    }
  }

}

function jump(){
  if(this.block.alive === false){return;}
  this.block.animations.play('flap');
  game.add.tween(this.block).to({angle: -20}, 100).start();
  this.block.body.velocity.y = -300;
}

function hitPipe(){
  if(this.block.alive === false){return;}
  this.block.alive = false;

  game.time.events.remove(this.pipeTimer);

  this.pipes.forEachAlive(stopPipe, this);

  var x = this.block.x,
      y = this.block.y;

  this.block.exists = false;
  this.boom.reset(x,y);
  this.boom.animations.play('boom');
  this.bgMusic.stop();
}

function stopPipe(pipe){
  pipe.body.velocity.x = 0;
}

function restartGame(){
  this.bgMusic.stop();
  game.state.start('main');
}

function addOnePipe(x, y, pos){
  var pipe = this.pipes.getFirstDead();
  pipe.frame = pos;
  pipe.reset(x, y);
  pipe.body.velocity.x = -150;
  pipe.checkWorldBounds = true;
  pipe.outOfBoundsKill = true;
};

function addPipeRow(){
  var hole = Math.floor(Math.random() * (320 - 170 + 1)) + 170,
      x    = 400,
      y;

  y = -1 * (320 - hole);
  this.addOnePipe(x, y, 0);
  y = y + 320 + 85;
  this.addOnePipe(x, y, 1);
}

game.state.add('main', mainState);
game.state.start('main');
