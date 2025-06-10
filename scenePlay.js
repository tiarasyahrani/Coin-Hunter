var scenePlay = new Phaser.Class({
    extends: Phaser.Scene,
    initialize: function(){
        Phaser.Scene.call(this, {key: "scenePlay"});
    },
    init: function(){},
    preload: function(){
this.load.setBaseURL('assets/');

this.load.image('background', 'BG.png');
this.load.image('btn_play', 'ButtonPlay.png');
this.load.image('coin', 'Koin.png');
this.load.image('coin_panel', 'PanelCoin.png');
this.load.image('ground', 'Tile50.png');

this.load.audio('snd_coin', 'koin.mp3');
this.load.audio('snd_lose', 'kalah.mp3');
this.load.audio('snd_jump', 'lompat.mp3');
this.load.audio('snd_leveling', 'ganti_level.wav');
this.load.audio('snd_walk', 'jalan.mp3');
this.load.audio('snd_touch', 'musuh1.mp3');
this.load.audio('music_play', 'music_play.mp3');

this.load.spritesheet('char', 'CharaSpriteAnim.png', { frameWidth: 45, frameHeight: 93 });



    },
    create: function(){ 


        var currentLevel = 1;

        this.gameStarted =false;

        this.snd_coin = this.sound.add('snd_coin');
        this.snd_jump = this.sound.add('snd_jump');
        this.snd_leveling = this.sound.add('snd_leveling');
        this.snd_lose = this.sound.add('snd_lose');
        this.snd_touch = this.sound.add('snd_touch');

        this.snd_walk = this.sound.add("snd_walk");

        this.snd_walk.loop = true;
        this.snd_walk.setVolume(0);
        this.snd_walk.play();

        this.music_play = this.sound.add('music_play');
        this.music_play.loop = true;


        X_POSITION={
            'LEFT': 0,
            'CENTER': game.config.width/2,
            'RIGHT': game.config.width,
        };
        Y_POSITION={ 
            'TOP': 0,
            'CENTER': game.config.height/2,
            'BOTTOM': game.config.height,
        };
        relativeSize={
            'w': 0,
            'h': 0,
        };
        var activeScene = this;

        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'background');
        var bg = this.add.image(game.config.width / 2, game.config.height / 2, 'background');
            bg.setDisplaySize(game.config.width, game.config.height);

        var coinPanel =this.add.image(X_POSITION.CENTER, 50, 'coin_panel');
        coinPanel.setDepth(10);

        var coinText = this.add.text(X_POSITION.CENTER, 50, '0',{
            fontFamily: 'Verdana, Arial',
            fontSize: '37px',
            color: "#adadad",
        });
        coinText.setOrigin(0.5);
        coinText.setDepth(10);

        var darkerLayer = this.add.rectangle(X_POSITION.CENTER, Y_POSITION.CENTER,
            game.config.width, game.config.height, 0x000000);
            darkerLayer.setDepth(10);
            darkerLayer.alpha = 0.25;
        var buttonPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'btn_play');
            buttonPlay.setDepth(10);
        

        buttonPlay.setInteractive();
        buttonPlay.on('pointerdown', function(pointer){
            this.setTint(0x5a5a5a);
        });
        buttonPlay.on('pointerout', function(pointer){
            this.clearTint();
        });
        buttonPlay.on('pointerup', function(pointer){
            this.clearTint();

            
        if (activeScene.sound.context.state === 'suspended') {
            activeScene.sound.context.resume();
        }

            activeScene.tweens.add({
                targets: this,
                ease: 'Black.In',
                duration: 250,
                scaleX: 0,
                scaleY: 0,
            });

            activeScene.tweens.add({
                targets: darkerLayer,
                delay: 150,
                duration: 250,
                alpha: 0,
            });

            activeScene.snd_touch.play();
            activeScene.music_play.play();

        });

        let groundTemp = this.add.image(0,0, 'ground').setVisible(false);
        let groundSize = { 'width': groundTemp.width, 'height': groundTemp.height};
        var platforms = this.physics.add.staticGroup();




        this.player = this.physics.add.sprite(100, 500, 'char');
        this.physics.add.collider(this.player, platforms);
        this.player.setGravityY(800);
        this.player.setBounce(0.2);

        this.cursors = this.input.keyboard.createCursorKeys();
 
        this.player.setCollideWorldBounds(true);


        var coins = this.physics.add.group();


        var prepareWorld = function(){

            platforms.clear(true, true);

            platforms.create(X_POSITION.CENTER - groundSize.width *4, Y_POSITION.BOTTOM - groundSize.height/2,'ground');
            platforms.create(X_POSITION.CENTER - groundSize.width * 3, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
            platforms.create(X_POSITION.CENTER - groundSize.width * 2, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
            platforms.create(X_POSITION.CENTER - groundSize.width, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
            platforms.create(X_POSITION.CENTER, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
            platforms.create(X_POSITION.CENTER + groundSize.width , Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
            platforms.create(X_POSITION.CENTER + groundSize.width * 2, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
            platforms.create(X_POSITION.CENTER + groundSize.width * 3, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
            platforms.create(X_POSITION.CENTER + groundSize.width * 4, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');

            platforms.create(groundTemp.width/1.2 + relativeSize.w, 454, 'ground');
            platforms.create(400 + relativeSize.w, 454, 'ground');
            platforms.create(600 + relativeSize.w, 614, 'ground');
    
            if(currentLevel == 1){
                platforms.create(groundTemp.width/1.2 + relativeSize.w, 454, 'ground');
                platforms.create(400 + relativeSize.w, 454, 'ground');
                platforms.create(600 + relativeSize.w, 614, 'ground');

            }

            else if(currentLevel == 2){
                platforms.create(80 + relativeSize.w, 284, 'ground');
                platforms.create(230 + relativeSize.w, 184, 'ground');
                platforms.create(390 + relativeSize.w, 284, 'ground');
                platforms.create(990 + relativeSize.w, 360, 'ground');
                platforms.create(620 + relativeSize.w, 430, 'ground');
                platforms.create(900 + relativeSize.w, 570, 'ground');

            }
            else{


                var x = Phaser.Math.Between(100, game.canvas.width - 100);
                var enemy = enemies.create(x, -100, 'enemy' + Phaser.Math.Between(1, 3));
                enemy.setBaseURL(1);
                enemy.setCollideWorldBounds(true);
                enemy.setVelocity(Phaser.Math.Between(-200, 200), 20);
                enemy.allowGravity = false;

                platforms.create(80 + relativeSize.w, 230, 'ground');
                platforms.create(230 + relativeSize.w, 230, 'ground');
                platforms.create(1040 + relativeSize.w, 280, 'ground');
                platforms.create(600 + relativeSize.w, 340, 'ground');
                platforms.create(400 + relativeSize.w, 420, 'ground');
                platforms.create(930 + relativeSize.w, 430, 'ground');
                platforms.create(820 + relativeSize.w, 570, 'ground');
                platforms.create(512 + relativeSize.w, 590, 'ground');
                platforms.create(0 + relativeSize.w, 570, 'ground');

            }


            coins.children.iterate(function (child){
                child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.3));
                child.enableBody(true, child.x, -100, true, true);
            });


        }

        prepareWorld();


        var enemies = this.physics.add.group();
        this.physics.add.collider(enemies, platforms);


        coins.create(X_POSITION.CENTER - groundSize.width * 2, Y_POSITION.BOTTOM - groundSize.height - 40, 'coin');
        coins.create(X_POSITION.CENTER + groundSize.width * 2, Y_POSITION.BOTTOM - groundSize.height - 40, 'coin');

        coins.create(groundTemp.width/2 + relativeSize.w, 340, 'coin');
        coins.create(400 + relativeSize.w, 384, 'coin');
        coins.create(1024 - groundTemp.width/2 + relativeSize.w, 440, 'coin');
        coins.create(600 + relativeSize.w, 544, 'coin');



        this.physics.add.collider(coins, platforms);



        let partikelCoin  = this.add.particles('coin');

        this.emmiterCoin = this.add.particles('coin', {
            speed: { min: 150, max: 250 },
            gravityY: 200,
            scale: { start: 1, end: 0 },
            lifespan: { min: 200, max: 300 },
            quantity: { min: 5, max: 15 },
            on: false 
        });

        var countCoin = 0;

        var collectCoin = function(player, coins){
            countCoin += 10;
            coinText.setText(countCoin);
            coins.disableBody(true, true);

            activeScene.snd_coin.play();

            activeScene.emmiterCoin.setPosition(coins.x, coins.y);
            activeScene.emmiterCoin.explode();

            if(coins.countActive && coins.countActive(true) === 0){
                currentLevel++;
                prepareWorld();
            }
        }

        this.physics.add.overlap(this.player, coins, collectCoin, null, this);
         

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('char', {start: 0, end: 3}),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('char', {start: 5, end: 8}),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'front',
            frames: [ {key: 'char', frame:4} ],
            frameRate: 20,
        });

        var hitEnemy =function(player, enemy){
            this.physics.pause();
            this.player,setTint(0xff0000);
        }
        this.physics.add.collider(this.player, enemies, hitEnemy, null, this);


    },
    update: function(){
        

        if(this.cursors.right.isDown){
            this.player.setVelocityX(200);
            this.player.anims.play('right', true);
            this.snd_walk.setVolume(1);
        }
        else if(this.cursors.left.isDown){
            this.player.setVelocityX(-200);
            this.player.anims.play('left', true);
            this.snd_walk.setVolume(1);
        }
        else{
            this.player.setVelocityX(0);
            this.player.anims.play('front');
            this.snd_walk.setVolume(0);
        }


        if(this.cursors.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-650);

            this.snd_jump.play();
        }
    }
})