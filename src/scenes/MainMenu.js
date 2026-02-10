export class MainMenu extends Phaser.Scene {

    constructor() {
        super('MainMenu');
    }

    preload() {
        this.load.audio('mainmenubgMusic', 'assets/audio/mainmenubgMusic.wav');
        this.load.image('grass', 'assets/grass.png');
    }

    create() {
        const bgMusic = this.sound.add('mainmenubgMusic');
        bgMusic.play({
            loop: true,
            volume: 0.5
        });

        this.grass = this.add.tileSprite(640, 360, 720, 360, 'grass');

        // Add menu elements
        this.add.text(640, 300, 'Main Menu', {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", serif',
            fontSize: '50px',
            color: '#ff69b4', // Pink color
            fontStyle: 'italic',
            stroke: '#fff',
            strokeThickness: 2
        }).setOrigin(0.5);

        const playButton = this.add.text(550, 350, 'Start Game', {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", serif',
            fontSize: '35px',
            color: '#ff69b4', // Pink color
            fontStyle: 'italic',
            stroke: '#fff',
            strokeThickness: 2
        }).setInteractive();

        this.tweens.add({
            targets: playButton,
            y: 370,
            duration: 1000,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1,
        });

        // Change scene on button click
        playButton.on('pointerdown', () => {
            bgMusic.stop();
            this.scene.stop(); 
            this.scene.start('Game'); // Stop MainMenu and start MainGame
        });

        if (this.sys.game.device.os.iOS || this.sys.game.device.os.android || this.sys.game.device.os.windowsPhone) {
            this.add.text(640, 100, 'This game only works on desktop.\r         \'Start Game\' is disabled', {
                fontFamily: 'Georgia, "Goudy Bookletter 1911", serif',
                fontSize: '20px',
                color: '#ff0000', // Red color
                fontStyle: 'italic',
                stroke: '#fff',
                strokeThickness: 2
            }).setOrigin(0.5);

            playButton.disableInteractive();
        }
    }

    update() {
        
    }
    
}
