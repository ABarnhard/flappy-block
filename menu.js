(function(){
    var menuState = {
            preload: preload,
            create: create,
            beginGame: beginGame
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
        spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.beginGame, this);
    }

    function beginGame(){
        game.state.start('main');
    }

    game.state.add('menu', menuState);
})();