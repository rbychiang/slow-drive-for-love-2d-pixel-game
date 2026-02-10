export class Pause extends Phaser.Scene {

    mainmenubgMusic;

    constructor() {
        super('Pause');
    }

    preload() {
        this.load.audio('mainmenubgMusic', 'assets/audio/mainmenubgMusic.wav');
        this.load.audio('bgMusic', 'assets/audio/bgMusic.wav');
        this.load.image('grass', 'assets/grass.png');
    }

    create() {
        this.mainmenubgMusic = this.sound.add('mainmenubgMusic');
        this.mainmenubgMusic.play({
                loop: true,
                volume: 0.5 // Set volume to 50%
            });

        this.grass = this.add.tileSprite(640, 360, 720, 360, 'grass');

        // Add menu elements
        this.add.text(640, 300, 'Game Paused', {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", serif',
            fontSize: '50px',
            color: '#ff69b4', // Pink color
            fontStyle: 'italic',
            stroke: '#fff',
            strokeThickness: 2
        }).setOrigin(0.5);

        const continueButton = this.add.text(450, 350, 'Continue', {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", serif',
            fontSize: '35px',
            color: '#ff69b4', // Pink color
            fontStyle: 'italic',
            stroke: '#fff',
            strokeThickness: 2
        }).setInteractive();

        const restartButton = this.add.text(650, 350, 'Restart Game', {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", serif',
            fontSize: '35px',
            color: '#ff69b4', // Pink color
            fontStyle: 'italic',
            stroke: '#fff',
            strokeThickness: 2
        }).setInteractive();

        this.tweens.add({
            targets: continueButton,
            y: 390,
            duration: 1000,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1,
        });

        this.tweens.add({
            targets: restartButton,
            y: 390,
            duration: 1000,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1,
        });

        const backButton = this.add.text(300, 200, 'Back to Main Menu', {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", serif',
            fontSize: '20px',
            color: '#ff69b4', // Pink color
            fontStyle: 'italic',
            stroke: '#fff',
            strokeThickness: 2
        }).setInteractive();

        // this.tweens.add({
        //     targets: playButton,
        //     y: 370,
        //     duration: 1000,
        //     ease: 'Sine.inOut',
        //     yoyo: true,
        //     loop: -1,
        // });

        // Change scene on button click
        continueButton.on('pointerdown', () => {
            this.scene.stop();
            this.mainmenubgMusic.stop();
            this.scene.resume('Game');
        });

        restartButton.on('pointerdown', () => {
            this.mainmenubgMusic.stop();
            this.scene.stop();
            this.scene.start('Game');
        });

        backButton.on('pointerdown', () => {
            this.mainmenubgMusic.stop();
            this.scene.stop();
            this.scene.stop('Game');
            this.scene.start('MainMenu');
        });
    }

    update() {
    }
    
}
