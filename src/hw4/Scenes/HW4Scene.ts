import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import Battler from "../GameSystems/BattleSystem/Battler";
import MainMenu from "./BeginningScenes/MainMenu";
import DeathScene from "./EndingScenes/DeathScene";

export default abstract class HW4Scene extends Scene {
    public level: number;
    protected PauseMenu: Layer;
    protected lvlScene: Layer;
    protected Controls: Layer;
    protected controlsSprite: any;
    
    protected gate_label: Label;
    protected player;
    protected healthbars;
    protected StaticHealthbars;
    protected TotalEnemies: number = 0;
    protected timer: Timer;
    protected pauseCount = 0;
    protected door;

    protected enemies;
    protected enemies_killed: number = 0;
    protected LevelEnd: [Vec2, Vec2];
    protected nextLevel: new (...args: any) => HW4Scene;
    protected currentLevel: new (...args: any) => HW4Scene;
    protected doorAudioPlayed: boolean;
    protected pause;
    tilemap: OrthogonalTilemap;

    protected restartButton;
    protected controlsButton;
    protected quitButton;
    protected back;

    public abstract getBattlers(): Battler[];

    public abstract getWalls(): OrthogonalTilemap;

    public abstract isTargetVisible(position: Vec2, target: Vec2): boolean;

    public loadScene() {
        this.load.image("test", "hw4_assets/SceneImages/BrownBackground.png");
        this.load.audio("door", "hw4_assets/Audio/SoundEffects/door_opening.mp3");
        this.load.image("controls", "hw4_assets/SceneImages/Controls_Image.png");
        this.receiver.subscribe("quit");
        this.load.image("health","hw4_assets/sprites/healthbar_png.png")
    }

    public startScene() {
        this.enemies_killed = 0;
        this.Controls = this.addUILayer("Controls");
        this.PauseMenu = this.addUILayer("PauseMenu");

        this.controlsSprite = this.add.sprite("controls", "Controls");
        this.controlsSprite.position.set(600, 370);
        this.controlsSprite.scale.set(1, 1);
        this.controlsSprite.visible = false;
        this.back = this.createButton("Back", new Vec2(140,50),"back");
        this.back.visible = false;

        this.restartButton = this.createButton("Restart", new Vec2(600, 250), "restart");
        this.controlsButton = this.createButton("Controls", new Vec2(600, 350), "controls");
        this.quitButton = this.createButton("Quit", new Vec2(600, 450), "quit");
        this.pauseGame();
        this.pauseCount++;
        

        window.addEventListener('keydown', (event) => {
            if (event.key === "Escape") {
                if (this.pauseCount === 0) {
                    this.pauseGame();
                    this.showPauseMenu();
                    this.pauseCount++;
                } else {
                    this.resumeGame();
                    this.pauseCount--;
                    this.hidePauseMenu();
                }
            }
        });
    }

    private showPauseMenu() {
        this.restartButton.visible = true;
        this.controlsButton.visible = true;
        this.quitButton.visible = true;
    }

    // Method to hide the pause menu UI
    private hidePauseMenu() {
        this.restartButton.visible = false;
        this.controlsButton.visible = false;
        this.quitButton.visible = false;
    }

    protected pauseGame() {
        this.timer.pause();
        this.player.freeze();
        for (let i =0; i< this.enemies.length; i++){
            console.log(this.enemies[i].id)
            this.enemies[i].freeze();
        }
        console.log("game paused");
    }

    protected resumeGame() {
        this.timer.start();
        this.player.unfreeze();
        for (let i =0; i< this.enemies.length; i++){
            this.enemies[i].unfreeze();
        }
        console.log("game resumed");
    }

    protected handleEnemiesKilled() {
        this.enemies = this.enemies.filter(enemy => {
            if (enemy.health === 0) {
                const healthbar = this.healthbars.get(enemy.id);
                if (healthbar) {
                    healthbar.visible = false;
                }
                this.enemies_killed++;
                console.log("enemy number", enemy, "health: ", enemy.health);
                console.log("enemies killed ", this.enemies_killed);
                return false;
            }
            return true;
        });

        if (this.enemies_killed === this.TotalEnemies) {
            this.changeDoorTiles();
            while (this.door == false){
                const doorOpen = <Label>this.add.uiElement(UIElementType.LABEL, "lvlScene", { position: new Vec2(600, 50), text: "The Gate is Open" });
                doorOpen.textColor = Color.WHITE;
                doorOpen.font = "Georgia";
                this.door = true;

            }
        
            if (this.PlayerAtDoor()) {
                //this.levelTransitionScreen.tweens.play("fadeIn");
                this.sceneManager.changeToScene(this.nextLevel);
            };

        } else {
            if (this.PlayerAtDoor()) {
                if (this.gate_label == null) {
                    const doorClosed = <Label>this.add.uiElement(UIElementType.LABEL, "lvlScene", { position: new Vec2(700, 50), text: "Kill All Enemies to Open the Gate" });
                    doorClosed.visible = true;
                    doorClosed.textColor = Color.WHITE;
                    doorClosed.font = "Georgia";
                    this.gate_label = doorClosed;
                } else {
                    this.gate_label.visible = true;
                }
            } else {
                if (this.gate_label != null) {
                    this.gate_label.visible = false;
                }
            }
        }

    }

    protected PlayerAtDoor(): boolean {
        return (
            this.player.position.y === this.LevelEnd[0].y &&
            (this.player.position.x >= this.LevelEnd[0].x && this.player.position.x <= this.LevelEnd[1].x)
        );
    }

    protected changeDoorTiles() {
        let i = 0;
        let position = new Vec2(this.LevelEnd[0].x, this.LevelEnd[0].y);

        while (i < 3) {
            let j = 0;
            let startPositionX = position.x;
            while (j < 3) {
                let tileposition = this.tilemap.getTileAtWorldPosition(position);
                switch (tileposition) {
                    case 13:
                        this.tilemap.setTileAtRowCol(this.tilemap.getColRowAt(position), 16);
                        console.log("topleft changed");
                        break;
                    case 14:
                        this.tilemap.setTileAtRowCol(this.tilemap.getColRowAt(position), 17);
                        console.log("topmiddle changed");
                        break;
                    case 15:
                        this.tilemap.setTileAtRowCol(this.tilemap.getColRowAt(position), 18);
                        console.log("topright changed");
                        break;
                    case 19:
                        this.tilemap.setTileAtRowCol(this.tilemap.getColRowAt(position), 22);
                        console.log("middleleft changed");
                        break;
                    case 20:
                        this.tilemap.setTileAtRowCol(this.tilemap.getColRowAt(position), 23);
                        console.log("middlemiddle changed");
                        break;
                    case 21:
                        this.tilemap.setTileAtRowCol(this.tilemap.getColRowAt(position), 24);
                        console.log("middleright changed");
                        break;
                    case 25:
                        this.tilemap.setTileAtRowCol(this.tilemap.getColRowAt(position), 28);
                        console.log("bottomleft changed");
                        break;
                    case 26:
                        this.tilemap.setTileAtRowCol(this.tilemap.getColRowAt(position), 29);
                        console.log("bottommiddle changed");
                        break;
                    case 27:
                        this.tilemap.setTileAtRowCol(this.tilemap.getColRowAt(position), 30);
                        console.log("bottomright changed");
                        break;
                    default:
                        break;
                }
                j++;
                position.x += 64;
            }
            position.x = startPositionX;
            i++;
            position.y -= 64;
        }
        
        if (!this.doorAudioPlayed) {
            console.log(this.doorAudioPlayed);
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "door", loop: false });
            this.doorAudioPlayed = true;
            console.log(this.doorAudioPlayed);
        }
        
    }

    private createButton(text: string, position: Vec2, eventId: string): any {
        const button = this.add.uiElement(UIElementType.BUTTON, "PauseMenu", {
            position: position,
            text: text
        });

        button.size.set(200, 50);
        button.borderWidth = 2;
        button.borderColor = Color.WHITE;
        button.backgroundColor = new Color(131, 115, 106, 1);
        button.onClickEventId = eventId;
        console.log("button created");
        console.log(eventId);
        this.receiver.subscribe(eventId);

        return button;
    }

    public updateScene(deltaT: number): void {
        this.handleEnemiesKilled();
        console.log("Player position:", this.player.position.x, this.player.position.y);
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            switch (event.type) {
                case "restart":
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "level_music" });
                    this.sceneManager.changeToScene(this.currentLevel);
                    break;
                case "controls":
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "level_music" });
                    this.controlsSprite.visible = true;
                    this.back.visible = true;
                    this.restartButton.visible = false;
                    this.controlsButton.visible = false;
                    this.quitButton.visible = false;
                    break;
                case "quit":
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "level_music" });
                    this.sceneManager.changeToScene(MainMenu);
                case "back":
                this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "level_music" });
                    this.back.visible = false;
                    this.controlsSprite.visible = false;
                    this.restartButton.visible = true;
                    this.controlsButton.visible = true;
                    this.quitButton.visible = true;
                break;
                default:
                    break;
            }
        }
        if (this.player.health<=0){
            this.sceneManager.changeToScene(DeathScene);
        }
        this.healthbars.forEach(healthbar => healthbar.update(deltaT));
        this.StaticHealthbars.forEach(healthbar => healthbar.update(deltaT));
    }
}
