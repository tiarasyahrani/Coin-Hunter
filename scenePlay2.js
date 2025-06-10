var scenePlay2 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function(){
        Phaser.Scene.call(this, {key: "scenePlay2"});
    },
    init: function(){},
    preload: function(){
        this.load.setBaseURL('assets/');
        this.load.image('background', 'BG.png');
        this.load.image('btn_play', 'ButtonPlay.png');
        this.load.image('coin', 'Koin.png');
        this.load.image('enemy1', 'Musuh01.png')
        this.load.image('enemy2', 'Musuh02.png')
        this.load.image('enemy3', 'Musuh03.png')
        this.load.image('coin_panel', 'PanelCoin.png');
        this.load.image('ground', 'Tile50.png');
        this.load.image('gameover', 'GameOver.png');
        this.load.audio('snd_coin', 'koin.mp3');
        this.load.audio('snd_lose', 'kalah.mp3');
        this.load.audio('snd_jump', 'lompat.mp3');
        this.load.audio('snd_leveling', 'ganti_level.mp3');
        this.load.audio('snd_walk', 'jalan.mp3');
        this.load.audio('snd_touch', 'musuh1.mp3');
        this.load.audio('music_play', 'music_play.mp3');
        this.load.spritesheet('char', 'CharaSpriteAnim.png', { frameWidth: 45, frameHeight: 93});

    },
    create: function(){


        var currentLevel = 1;

        this.gameStarted =true;

        this.snd_coin = this.sound.add('snd_coin');
        this.snd_jump = this.sound.add('snd_jump');
        this.snd_leveling = this.sound.add('snd_leveling');
        this.snd_lose = this.sound.add('snd_lose');
        this.snd_touch = this.sound.add('snd_touch');

        this.snd_walk = this.sound.add("snd_walk");
        this.snd_walk.loop = true;
        this.snd_walk.setVolume(0);
        this.snd_walk.play();

        this.music_play =this.sound.add('music_play');
        this.music_play.loop =true;


        X_POSITION={
            'LEFT' : 0,
            'CENTER' : game.canvas.width/2,
            'RIGHT' : game.canvas.width,
        };
        Y_POSITION={
            'TOP' : 0,
            'CENTER' : game.canvas.height/2,
            'BOTTOM' : game.canvas.height,
        };
        relativeSize={
            'w': ((game.canvas.width - layoutSize.w)/2),
            'h': ((game.canvas.height - layoutSize.h)/2)
        };

        var activeScene =this;

        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'background');

        var coinPanel = this.add.image(X_POSITION.CENTER, 50, 'coin_panel');
        coinPanel.setDepth(10);

        var coinText = this.add.text(X_POSITION.CENTER, 45, '0',{
            fontFamily: 'Verdana, Arial',
            fontSize: '37px',
            color: '#adadad'
        });
        coinText.setOrigin(0.5);
        coinText.setDepth(10);

        var darkerLayer = this.add.rectangle(X_POSITION.CENTER, Y_POSITION.CENTER,
            game.canvas.width, game.canvas.height, 0x000000);
        darkerLayer.alpha = 0.25;
        var buttonPlay =this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'btn_play');
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

            activeScene.tweens.add({
                targets: this,
                ease: 'Back.In',
                duration: 250,
                scaleX: 0,
                scaleY: 0,
            });
            activeScene.tweens.add({
                delay: 150,
                targets: darkerLayer,
                duration: 250,
                alpha: 0,
                onComplete: function(){
                    activeScene.gameStarted = true;
                    activeScene.physics.resume();
                }
            });

            activeScene.snd_touch.play();
            activeScene.music_play.play();
        });


        let groundTemp = this.add.image(0,0, 'ground').setVisible(false);
        let groundSize = { 'width': groundTemp.width, 'height': groundTemp.height};
        var platforms = this.physics.add.staticGroup();

        
        platforms.create(X_POSITION.CENTER - groundSize.width * 4, Y_POSITION.BOTTOM - groundSize.height/2,'ground');
        platforms.create(X_POSITION.CENTER - groundSize.width * 3, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
        platforms.create(X_POSITION.CENTER - groundSize.width * 2, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
        platforms.create(X_POSITION.CENTER - groundSize.width, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
        platforms.create(X_POSITION.CENTER, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
        platforms.create(X_POSITION.CENTER + groundSize.width , Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
        platforms.create(X_POSITION.CENTER + groundSize.width * 2, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
        platforms.create(X_POSITION.CENTER + groundSize.width * 3, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');
        platforms.create(X_POSITION.CENTER + groundSize.width * 4, Y_POSITION.BOTTOM - groundSize.height/2, 'ground');

        platforms.create(groundTemp.width/2 + relativeSize.w, 384, 'ground');
        platforms.create(400 + relativeSize.w, 424, 'ground');
        platforms.create(1024 - groundTemp.width/2 + relativeSize.w, 480, 'ground');
        platforms.create(600 + relativeSize.w, 584, 'ground');

        var coins = this.physics.add.group({
            key: 'coin',
            repeat: 9,
            setXY: { x: 60 + relativeSize.w, y: 100, stepX: 100}
        })

        this.physics.add.collider(coins, platforms);




        this.player = this.physics.add.sprite(100, 500, 'char');

        this.physics.add.collider(this.player, platforms);
        this.player.setGravity(0, 800);
        this.player.setBounce(0.2);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.player.setCollideWorldBounds(true);


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


        var newLevelTransition = function(){
            activeScene.snd_leveling.play();
            var newLevelTransitionText = activeScene.add.text(X_POSITION.CENTER, Y_POSITION.CENTER, 'Level' + currentLevel, {
                fontFamily: 'Verdana, Arial',
                fontSize: '40px',
                color: '#ffffff'
            });
            newLevelTransitionText.setOrigin(0.5);
            newLevelTransitionText.setDepth(10);
            newLevelTransitionText.alpha = 0;

            activeScene.tweens.add({
                targets: newLevelTransitionText,
                duration: 1000,
                alpha: 1,
                yoyo: true,
                onComplete: function(){
                    newLevelTransitionText.destroy();
                }
            });

            activeScene.tweens.add({
                delay: 2000,
                targets: darkerLayer,
                duration:250,
                alpha: 0,
                onComplete: function(){
                    activeScene.gameStarted =true;
                    activeScene.physics.resume();
                }
            });
        };

        var countCoin = 0;


        var collectCoin = function(player, coin){
            countCoin += 10;
            coinText.setText(countCoin);
            coin.disableBody(true, true);

            activeScene.snd_coin.play();

            if(coins.countActive(true) === 0){
                currentLevel++;

                activeScene.snd_walk.setVolume(0);
                activeScene.gameStarted =false;
                activeScene.physics.pause();
                activeScene.player.anims.play('turn');
                activeScene.tweens.add({
                  targets: darkerLayer,
                  duration: 250,
                  alpha: 1,
                  onComplete: function(){

                    prepareWorld();
                    newLevelTransition()

                  }  
                })
            }
        }

        this.physics.add.overlap(this.player, coins, collectCoin, null, this);



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


            if(currentLevel > 3){
                var x = Phaser.Math.Between(100, game.canvas.width - 100);
                var enemyKey = 'enemy' + Phaser.Math.Between(1, 3); // enemy1, enemy2, atau enemy3
                var enemy = enemies.create(x, -100, enemyKey);
                enemy.setBounce(1);
                enemy.setCollideWorldBounds(true);
                enemy.setVelocity(Phaser.Math.Between(-200, 200), 100);
                enemy.allowGravity = false;
            }
            
            else if(currentLevel == 1){
                platforms.create(groundTemp.width/2 + relativeSize.w, 384, 'ground');
                platforms.create(400 + relativeSize.w, 424, 'ground');
                platforms.create(1024 - groundTemp.width/2 + relativeSize.w, 480, 'ground');
                platforms.create(600 + relativeSize.w, 584, 'ground');

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
                child.body.setGravityY(500);  
                child.enableBody(true, child.x, -100, true,true);
            });
        }

        var enemies = this.physics.add.group();
        this.physics.add.collider(enemies, platforms);

        prepareWorld();


        var hitEnemy = function(player, enemy){
            this.snd_touch.play();
            this.physics.pause();
            this.player.setTint(0xff0000);
            this.snd_lose.play();

            var gameOverImage = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER - 50, 'gameover');
            gameOverImage.setDepth(20);

            var darkerLayer = this.add.rectangle(X_POSITION.CENTER, Y_POSITION.CENTER,
                game.canvas.width, game.canvas.height, 0x000000);
            darkerLayer.setDepth(19);
            darkerLayer.alpha = 0.5;

            var restartButton = this.add.text(X_POSITION.CENTER, Y_POSITION.CENTER + 150, 'Restart', {
                fontSize: '32px',
                fill: '#fff',
                backgroundColor: '#000',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive().setDepth(20);
            
            restartButton.on('pointerup', () => {
                this.music_play.stop();
                this.scene.restart();
            });
            
        }
        this.physics.add.collider(this.player, enemies, hitEnemy, null, this);

        this.physics.pause();
    },
    update: function(){
        if(!this.gameStarted){
            return;
        }

        if(this.cursors.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-550);
            this.snd_jump.play();
        }
        else if(this.cursors.right.isDown){
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



    },
})