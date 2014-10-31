'use strict';

var game = new Phaser.Game(500, 320, Phaser.CANVAS, '', {preload:preload, create:create, update:update});

function preload(){
  game.load.tilemap('map', '/assets/ds-ionicphaser.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('Mario', '/assets/super_mario.png');
  game.load.spritesheet('dude', '/assets/dude.png', 32, 48);
  game.load.spritesheet('coin', '/assets/coin.png', 32, 32);

  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.refresh();
}

var map, background, ground, clouds, blocks, dude, money;

function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  map = game.add.tilemap('map');
  map.addTilesetImage('mario', 'Mario');

  background = map.createLayer('Background');
  clouds = map.createLayer('Clouds');
  ground = map.createLayer('Ground');
  blocks = map.createLayer('Blocks');
  background.resizeWorld();

  map.setCollision(24, true, 'Blocks');

  dude = game.add.sprite(0,0, 'dude');
  dude.animations.add('left', [0, 1, 2, 3], 10, true);
  dude.animations.add('right', [5, 6, 7, 8], 10, true);
  game.physics.arcade.enable(dude);
  game.camera.follow(dude);

  dude.body.gravity.y = 500;

  money = game.add.group();
  money.enableBody = true;
  money.physicsBodyType = Phaser.Physics.ARCADE;
  map.createFromObjects('coins', 45, 'coin', 0, true, false, money);
  money.callAll('animations.add', 'animations', 'spin', [0,1,2,3,4,5], 10, true);
  money.callAll('animations.play', 'animations', 'spin');

  dude.body.collideWorldBounds = true;

}



function update(){

  game.physics.arcade.collide(dude, blocks);
  game.physics.arcade.overlap(dude, money, collectMoney);

  if(game.input.activePointer.isDown){
    if(game.input.activePointer.x < 150){
      dude.body.velocity.x = -150;
      dude.animations.play('left');
    }else{
      dude.body.velocity.x = 150;
      dude.animations.play('right');
    }
  }else{
    dude.body.velocity.x = 0;
    dude.animations.stop();
    dude.frame = 4;
  }

  if(game.input.activePointer.isDown){
    if(game.input.activePointer.y < 100){
      dude.body.velocity.y = -500;
    }
  }

}

function collectMoney(dude, money){
    money.kill();
  }
