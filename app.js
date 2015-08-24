var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('background', 'images/city.jpg');

    game.load.image('atari', 'images/atari130xe.png');

    game.load.image('badDev', 'images/Transparent_Troll_Face.png');
    game.load.image('goodDev', 'images/master.png');

    game.load.image('alex', 'images/alex.png');
    game.load.image('douglas', 'images/douglas.png');
    game.load.image('malik', 'images/malik.png');
    game.load.image('nico', 'images/nico.png');
    game.load.image('thomas', 'images/thomas.png');

    game.load.image('rh', 'images/beball1.png');

}

var sprites = [];

var sprite2;
var levelText;
var scoreText;
var messageText;
var timerText;
var score;
var timer = 0;

var level = {
    number: 1,
    goal: 8,
    timer: 60,
    goodDev: {
        point: 1

    },
    badDev: {
        probability: 0.2,
        point: -2
    },
    superDev: {
        point: 5,
        probability: 0.1
    },
    devSpeed: 225,
    rhSpeed: 250
};

var superDevsImages = [
    'alex',
    'douglas',
    'malik',
    'nico',
    'thomas'
];

function addDev() {
    var x = Math.random() * 580;
    var newSprite;
    var random = Math.random();
    if(random < level.badDev.probability) {
        newSprite = game.add.sprite(x, 50, 'badDev');
        newSprite.name = 'badDev';
    }
    else if (random > 1 - level.superDev.probability) {
        var superDevImage = superDevsImages[Math.floor(Math.random()*superDevsImages.length)];

        newSprite = game.add.sprite(x, 150, superDevImage);
        newSprite.name = 'superDev';
    }
    else {
        newSprite = game.add.sprite(x, 50, 'goodDev');
        newSprite.name = 'goodDev';
    }
    game.physics.arcade.enable(newSprite, true);

    newSprite.body.velocity.y = level.devSpeed;
    newSprite.body.setSize(50, 50, 0, 0);
    sprites.push(newSprite);
}

function initLevel () {
    timer = level.timer;
    if(levelText && scoreText && timerText) {
        levelText.destroy(true);
        scoreText.destroy(true);
        timerText.destroy(true);
    }
    if(messageText) {
        messageText.destroy(true);
    }
    score = 0;
    levelText = game.add.text(16, 16, 'Level ' + level.number, { fontSize: '32px', fill: '#000' });
    scoreText = game.add.text(16, 46, 'Score: 0/' + level.goal, { fontSize: '32px', fill: '#000' });
    timerText = game.add.text(650, 16, 'Timer: ' + timer, { fontSize: '32px', fill: '#000' });
}

function create() {

    game.add.tileSprite(0, 0, 800, 600, 'background');
    initLevel();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#2d2d2d';

    sprite2 = game.add.sprite(400, 450, 'rh');
    sprite2.name = 'rh';
    //  We need to enable physics on the player
    game.physics.arcade.enable(sprite2);

    //  Player physics properties. Give the little guy a slight bounce.
    sprite2.body.bounce.y = 0.2;
    sprite2.body.gravity.y = 300;
    sprite2.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    // sprite2.animations.add('left', [0, 1, 2, 3], 10, true);
    // sprite2.animations.add('right', [5, 6, 7, 8], 10, true);

    // game.physics.enable(sprite2, Phaser.Physics.ARCADE);

    //  Reset the players velocity (movement)
    sprite2.body.velocity.x = 0;
    window.setInterval(addDev, 800 + Math.random() * 600);
    window.setInterval(function (){
        timer = timer - 1;
        timerText.text = 'Timer: ' + timer;
    }, 1000);
}

function update() {

    if(timer === 0 || score < 0) {
        messageText = game.add.text(325, 200, 'YOU LOST !!', { fontSize: '32px', fill: '#000' });
    }
    if(score >= level.goal) {
        levelUp();
    }

    cursors = game.input.keyboard.createCursorKeys();
    sprites.forEach(function (sprite) {
        game.physics.arcade.collide(sprite, sprite2, collisionHandler, null, this);
    });
    if (cursors.left.isDown)
    {
        //  Move to the left
        sprite2.body.velocity.x = -level.rhSpeed;

        sprite2.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        sprite2.body.velocity.x = level.rhSpeed;

        sprite2.animations.play('right');
    }
    else
    {
        //  Stand still
        sprite2.animations.stop();

        sprite2.frame = 4;
    }
}

function collisionHandler (obj1, obj2) {
    score += level[obj1.name].point; //badDev.point is negative
    scoreText.text = 'Score: ' + score + '/' + level.goal;
    obj1.destroy(true);
}

function levelUp () {
    score = 0;

    messageText = game.add.text(325, 200, 'YOU WON :)', { fontSize: '32px', fill: '#000' });
    timer = level.timer - 1;
    level.number++;
    level.goal++;

    if(level.badDev.probability < 0.6) {
        level.badDev.probability += 0.1;
    }

    level.rhSpeed += 40;
    level.devSpeed += 40;
    window.setTimeout(initLevel, 1500);
}
function render() {

    // game.debug.body(sprite1);
    // game.debug.body(sprite2);

}