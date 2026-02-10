export class Game extends Phaser.Scene {

    cursors;
    car;
    emitter;
    isMessageVisible;
    nextMessageLocationX;
    nextMessageLocationY;
    nextFlowerLocationX;
    nextFlowerLocationY;
    collider;
    gameComplete;
    counter;
    maximumHeartCount;
    score;

    bgMusic;
    winHeartSound;
    countdownSound;
    grassSound;

    initialTime;
    timerText;
    timedEvent;

    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('lane1', 'assets/lane1.png');
        this.load.image('lane2', 'assets/lane2.png');
        this.load.image('lane3', 'assets/lane3.png');
        this.load.image('car', 'assets/car.png');
        this.load.image('heart', 'assets/heart.png');
        this.load.image('grass', 'assets/grass.png');
        this.load.image('grassLeftTree', 'assets/grass-left-tree.png');
        this.load.image('grassRightTree', 'assets/grass-right-tree.png');

        this.load.image('chocoFull', 'assets/choco-full.png');

        this.load.spritesheet('redFlower1', 'assets/red-flower-1-sheet.png',  { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('yellowFlower1', 'assets/yellow-flower-1-sheet.png',  { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('whiteFlower1', 'assets/white-flower-1-sheet.png',  { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('blueFlower1', 'assets/blue-flower-1-sheet.png',  { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('purpleFlower1', 'assets/purple-flower-1-sheet.png',  { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('pinkRedFlower1', 'assets/pink-red-flower-1-sheet.png',  { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('sakuraFlower1', 'assets/sakura-flower-1-sheet.png',  { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('purpleBlueFlower1', 'assets/purple-blue-flower-1-sheet.png',  { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('pinkWhiteFlower1', 'assets/pink-white-flower-1-sheet.png',  { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('chocolate', 'assets/chocolate-sheet.png',  { frameWidth: 32, frameHeight: 32 });

        this.load.audio('bgMusic', 'assets/audio/bgmusic.wav');
        this.load.audio('endMusic', 'assets/audio/endMusic.wav');
        this.load.audio('clappingsound', 'assets/audio/clappingsound.wav');
        this.load.audio('winheart', 'assets/audio/winheart.wav');
        this.load.audio('losesound', 'assets/audio/losesound.wav');
        this.load.audio('grasssound', 'assets/audio/grasssound.wav');
        this.load.audio('countdownsound', 'assets/audio/countdownsound.wav');
    }

    create() {
        // Initialise background music
        this.bgMusic = this.sound.add('bgMusic');
        
        // Initialise win heart and grass sounds
        this.winHeartSound = this.sound.add('winheart');
        this.grassSound = this.sound.add('grasssound');

        // Setup tile sprites
        this.grass = this.add.tileSprite(640, 360, 720, 360, 'grass');
        this.grassLeftTree = this.add.tileSprite(595, 360, 50, 360, 'grassLeftTree');
        this.grassRightTree = this.add.tileSprite(700, 360, 50, 360, 'grassRightTree');
        this.lane1 = this.add.tileSprite(610, 360, 0, 360, 'lane1');
        this.lane2 = this.add.tileSprite(640, 360, 0, 360, 'lane2');
        this.lane3 = this.add.tileSprite(670, 360, 0, 360, 'lane3');

        // Initialize max heart count
        this.maximumHeartCount = 10;

        // Setup car as the player
        this.car = this.physics.add.sprite(610, 500, 'car');
        this.car.body.allowGravity = false;
        this.car.body.setCollideWorldBounds(true);
        this.physics.world.bounds.left = 590;
        this.physics.world.bounds.right = 690;

        // Activate cursors to detect keys
        this.cursors = this.input.keyboard.createCursorKeys();

        this.emitter = this.add.particles(0, 0, 'heart', {
            speed: 100,
            frequency: -1,
        });

        this.nextMessageLocationX = 100;
        this.nextMessageLocationY = 0;

        this.nextFlowerLocationX = 310;
        this.nextFlowerLocationY = 220;

        this.counter = 0;

        this.add.text(400, 100, 'Total Hearts: ', {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", serif',
            fontSize: '32px',
            color: '#ff69b4', // Pink color
            fontStyle: 'italic',
            stroke: '#fff',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.score = this.add.text(550, 100, `${this.counter} / ${this.maximumHeartCount}`, {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", serif',
            fontSize: '32px',
            color: '#ff69b4', // Pink color
            fontStyle: 'italic',
            stroke: '#fff',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Count down
        this.initialTime = 3; // seconds
        this.countdownSound = this.sound.add('countdownsound');
        this.countdownSound.play({
            volume: 0.4 // Set volume to 40%
        });
        this.timerText = this.add.text(640, 300, this.initialTime, {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", serif',
            fontSize: '50px',
            color: '#ff69b4', // Pink color
            fontStyle: 'italic',
            stroke: '#fff',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.timedEvent = this.time.addEvent({ 
            delay: 1000, 
            callback: (() => {
                this.initialTime -= 1; // Decrease timer
                this.timerText.setText(this.initialTime);

                if (this.initialTime <= 0) {
                    this.timedEvent.paused =  true; // Stop loop
                    this.timerText.visible = false;
                    this.startGame();
                }
            }), 
            callbackScope: this, 
            loop: true
        });
    }

    update() {
        this.grass.tilePositionY -= 0.6;
        this.grassLeftTree.tilePositionY -= 0.6;
        this.grassRightTree.tilePositionY -= 0.6;
        this.lane1.tilePositionY -= 1;
        this.lane2.tilePositionY -= 1;
        this.lane3.tilePositionY -= 1;

        this.events.on('resume', function (scene, data) {
            // Restart count down if count down wasn't completed initially
            if(!this.timedEvent.paused){
                this.initialTime = 3;
                this.timerText.setText(this.initialTime);

                this.countdownSound.play();

                this.timedEvent.reset({
                    delay: 1000, 
                    callback: (() => {
                        this.initialTime -= 1; // Decrease timer
                        this.timerText.setText(this.initialTime);

                        if (this.initialTime <= 0) {
                            this.timedEvent.paused =  true;  // Stop loop
                            this.timerText.visible = false;
                            this.startGame();
                        }
                    }), 
                    callbackScope: this, 
                    loop: true
                });
            }
            else{
                this.bgMusic.play({
                    loop: true,
                    volume: 0.5 // Set volume to 50%
                });
            }
        }, this);

        if(this.cursors.space.isDown){
            this.bgMusic.stop();
            this.countdownSound.stop();
            this.grassSound.stop();
            this.scene.pause(); 
            this.scene.launch('Pause');
        }

        if(this.cursors.left.isDown){
            this.car.setVelocityX(-160); // Move left
        }
        else if(this.cursors.right.isDown){
            this.car.setVelocityX(160); // Move right
        }
        else {
            this.car.setVelocityX(0); // Stop moving
        }

        if(this.counter == 5){
            this.nextMessageLocationX = 1170;
            this.nextMessageLocationY = 0;

            this.nextFlowerLocationX = 970;
            this.nextFlowerLocationY = 220;
        }
    }

    startGame(){
        this.bgMusic.play({
            loop: true,
            volume: 0.5 // Set volume to 50%
        });
        
        // Setup heart spawn logic
        const heart = this.physics.add.image(610, 180, 'heart');
        const changeImageOnRepeat = (tween, target) => {
            let randomHeartLocation = Phaser.Utils.Array.GetRandom([610, 640, 670]);
            target.x = randomHeartLocation;
        };
        this.tweens.add({
            targets: heart,
            // alpha: 0, //fadeout
            y: 500,
            duration: 2000,
            // ease: 'Sine.inOut',
            // yoyo: true,
            // loop: -1,
            repeat: this.maximumHeartCount - 1,
            // loopDelay: 1000,
            onRepeat: changeImageOnRepeat,
            onComplete: this.endGame.bind(this)
        });

        this.collider = this.physics.add.overlap(this.car, heart, this.heartCaptured, null, this);
    }

    heartCaptured(car, heart){
        this.winHeartSound.play({
            volume: 0.1 // Set volume to 10%, 
        });

        this.emitter.setPosition(car.x, car.y);
        this.emitter.explode(10);
        this.showPopup(car);
        this.bloomFlower();
        this.collider.active = false;

        // Ensure overlap once
        this.time.delayedCall(1000, () => {
            this.collider.active = true;    
        }, [], this);

        this.counter += 1;

        this.score.text = `${this.counter} / ${this.maximumHeartCount}`;
    }

    showPopup(car) {
        // if (!this.isMessageVisible) {
        //     this.isMessageVisible = true;
            // this.popupText.visible = true;
            // this.popupText.x = car.x;
            // this.popupText.y = car.y;

            const popupText = this.add.text(car.x, car.y, 'I love you!', {
                fontFamily: 'Georgia, "Goudy Bookletter 1911", serif',
                fontSize: '25px',
                color: '#ff69b4', // Pink color
                fontStyle: 'italic',
                stroke: '#fff',
                strokeThickness: 1
            }).setOrigin(0.5);

            this.nextMessageLocationY += 100;

            this.tweens.add({
                targets: popupText,
                x:this.nextFlowerLocationX,
                y:this.nextFlowerLocationY,
                duration: 1000,
                alpha: 0.5
            });

            // if (popupText.alpha < 1) popupText.alpha += 0.05;

            // Remove after 1 second
            this.time.delayedCall(1000, () => {
                // this.isMessageVisible = false;
                popupText.visible = false;         
            }, [], this);
            
        // }
    }

    bloomFlower(){
        if(this.counter == this.maximumHeartCount - 1){
            console.log('Chocolate');
            const chocolate = this.add.sprite(this.nextFlowerLocationX - 10, this.nextFlowerLocationY, 'chocolate');
            chocolate.setScale(2);

            this.tweens.add({
                targets: chocolate,
                x: 640,
                y: 400,
                duration: 1000,
                ease: 'Linear',
                onComplete: (() => {
                    this.time.delayedCall(1000, () => {
                        this.emitter = this.add.particles(640, 400, 'chocoFull', {
                            speed: 500,
                            frequency: 10,
                            duration: 2000,
                        });           
                    }, [], this);   
                }).bind(this),
            });

            chocolate.anims.create({
                key: 'bloom',
                frames: this.anims.generateFrameNumbers('chocolate', { start: 0, end: 2 }),
                duration: 2000
            });

            chocolate.play('bloom');    
        }
        else{
            const flowers = ['redFlower1', 'purpleFlower1', 'yellowFlower1', 'pinkWhiteFlower1', 'whiteFlower1', 'sakuraFlower1', 'blueFlower1', 'pinkRedFlower1', 'purpleBlueFlower1'];
            const nextFlower = flowers[this.counter];
        
            this.grassSound.play({
                volume: 0.4 // Set volume to 40%,      
            });

            // Stop sound after 1.5 second
            this.time.delayedCall(1500, () => {
                this.grassSound.stop();    
            }, [], this);

            const currentFlower = this.add.sprite(this.nextFlowerLocationX, this.nextFlowerLocationY, nextFlower);
            currentFlower.setScale(2);
            currentFlower.anims.create({
                key: 'bloom',
                frames: this.anims.generateFrameNumbers(nextFlower, { start: 0, end: 2 }),
                duration: 2000
            });

            currentFlower.play('bloom');

            this.nextFlowerLocationY += 70;
        }  
    }

    endGame(tween, targets){
        targets[0].destroy();

        this.bgMusic.stop();

        let win = false;

        let text = '';
        if(this.counter == this.maximumHeartCount){
            text = 'Wow you caught all my hearts!\r Happy Valentine\'s Day';
            win = true;
        }
        else if(this.counter == 0){
            text = 'Oh no! You missed all my hearts!\r That\'s OK, let\'s try again!\r Happy Valentine\'s Day';
        }
        else if(this.counter >= this.maximumHeartCount/2){
            text = 'Wow you caught most of my hearts!\r Happy Valentine\'s Day';
            win = true;
        }
        else{
            text = 'Aww! You missed most of my hearts!\r But at least you caught the best ones!\r Happy Valentine\'s Day';
        }

        if(win){
            const endMusic = this.sound.add('endMusic');
            endMusic.play({
                loop: true,
                repeat: 1,
                volume: 0.4 // Set volume to 40%,      
            });

            let loopCount = 0;

            endMusic.on('looped', () => {
                loopCount++;

                // After it has looped once (meaning it has played 2 times total)
                if (loopCount >= 1) {
                    endMusic.stop(); // Stop the music
                }
            });

            const clappingsound = this.sound.add('clappingsound');
            clappingsound.play({
                volume: 0.3 // Set volume to 30%,      
            });
        }
        else{
            const loseSound = this.sound.add('losesound');
            loseSound.play({
                volume: 0.25 // Set volume to 25%,      
            });
        }
        
        const popupText = this.add.text(640, 300, text, {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", serif',
            fontSize: '32px',
            color: '#ff69b4', // Pink color
            fontStyle: 'italic',
            stroke: '#fff',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.tweens.add({
            targets: popupText,
            duration: 1000,
        });    
    }
}
