import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import { BattlerEvent, LevelEvent } from "../Events";
import Battler from "../GameSystems/BattleSystem/Battler";
import ControlScene2 from "./BeginningScenes/ControlScene";
import MainMenu from "./BeginningScenes/MainMenu";

export default abstract class HW4Scene extends Scene {
    public level: number;
    protected PauseMenu: Layer;

    protected player
    protected healthbars;
    protected TotalEnemies:number = 0;

    protected enemies;
    protected enemies_killed: number = 0;
    protected LevelEnd: [Vec2, Vec2];
    protected nextLevel: new (...args: any) => HW4Scene;
    protected currentLevel: new (...args: any) => HW4Scene;


    //setTileAtRowCol
    public abstract getBattlers(): Battler[];

    public abstract getWalls(): OrthogonalTilemap;


    public abstract isTargetVisible(position: Vec2, target: Vec2): boolean;
    
    public loadScene() {
        this.load.image("test", "hw4_assets/SceneImages/BrownBackground.png");
        this.receiver.subscribe("quit")
    }
    public startScene() {
        this.enemies_killed =0;
        
        this.subscribeToEvents();
        const center = this.viewport.getCenter();
        this.PauseMenu = this.addUILayer("PauseMenu")
        let x = this.add.sprite("test", "PauseMenu")
        x.position.set(center.x, center.y);
        x.scale.set(5,5);

        this.createButton("Restart", new Vec2(600,250), "restart");
        this.createButton("Controls", new Vec2(600, 350), "controls");
        this.createButton("Quit", new Vec2(600, 450), "quit");
        console.log("enemies from hw4",this.enemies)
        
    }
    
    /*
    private getLevel(levelNumber: number) {
        switch (levelNumber) {
            case 1:
                //return lvl1Scene;
                this.sceneManager.changeToScene(lvl1Scene);
            default:
                break;
            }
        }
        */
       protected subscribeToEvents(){
           this.receiver.subscribe([
               BattlerEvent.BATTLER_KILLED,
               LevelEvent.PLAYER_ENTERED_LEVEL_END
            ]);
        }
        protected handleEnemiesKilled() {
            this.enemies = this.enemies.filter(enemy => {
                if (enemy.health === 0) {
                    this.enemies_killed++;
                    console.log("enemy number", enemy, "health: ", enemy.health);
                    console.log("enemies killed ", this.enemies_killed);
                    return false; // Filter out the enemy with zero health
                }
                return true; // Keep enemies with non-zero health
            });
        
            if (this.enemies_killed === this.TotalEnemies){

                this.PlayerAtDoor();
                
            }
            
        }
        protected PlayerAtDoor(){
            if (
                this.player.position.y === this.LevelEnd[0].y &&
                (this.player.position.x >= this.LevelEnd[0].x && this.player.position.x <= this.LevelEnd[1].x)
        ) {
            this.sceneManager.changeToScene(this.nextLevel);
            console.log("player reached end");
        }
    }

    private createButton(text: string, position: Vec2, eventId: string): void {
        const button = this.add.uiElement(UIElementType.BUTTON, "PauseMenu", {
            position: position,
            text: text
        });

        button.size.set(200, 50);
        button.borderWidth = 2;
        button.borderColor = Color.WHITE;
        button.backgroundColor = Color.TRANSPARENT;
        button.onClickEventId = eventId;
        console.log("button created")
        console.log(eventId)
        this.receiver.subscribe(eventId);
    
    }

    public updateScene(deltaT: number): void {
        this.handleEnemiesKilled()
        console.log("Player position:", this.player.position.x, this.player.position.y);
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            switch (event.type) {
                case "restart":
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
                    this.sceneManager.changeToScene(this.currentLevel);
                    console.log("restart button pressed")
                    break;
                case "controls":
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
                    this.sceneManager.changeToScene(ControlScene2);
                    console.log("controls button pressed")
                    break;
                case "quit":
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
                    this.sceneManager.changeToScene(MainMenu);
                    console.log("quit button pressed")
                    break;
                default:
                    break;
            }
        }
        this.healthbars.forEach(healthbar => healthbar.update(deltaT));
    }

}