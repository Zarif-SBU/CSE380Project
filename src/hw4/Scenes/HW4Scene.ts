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
import LevelSelectScene from "./BeginningScenes/LevelSelectScreen";
import MainMenu from "./BeginningScenes/MainMenu";



export default abstract class HW4Scene extends Scene {
    public level: number;
    protected PauseMenu: Layer;

    protected player
    protected healthbars;
    protected TotalEnemies:number;

    protected enemies_killed: number;
    protected LevelEnd: [Vec2, Vec2];
    protected nextLevel;

    
    public abstract getBattlers(): Battler[];

    public abstract getWalls(): OrthogonalTilemap;


    public abstract isTargetVisible(position: Vec2, target: Vec2): boolean;
    
    public loadScene() {
        this.load.image("test", "/dist/hw4_assets/SceneImages/BrownBackground.png");
        this.receiver.subscribe("quit")
    }
    public startScene() {
        this.enemies_killed =0;

        const center = this.viewport.getCenter();
        this.PauseMenu = this.addUILayer("PauseMenu")
        let x = this.add.sprite("test", "PauseMenu")
        x.position.set(center.x, center.y);
        x.scale.set(5,5);

        this.createButton("Restart", new Vec2(600,250), "restart");
        this.createButton("Controls", new Vec2(600, 350), "controls");
        this.createButton("Quit", new Vec2(600, 450), "quit");
        
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
        //console.log("Player position:", this.player.position.x, this.player.position.y);
        
        if (
            this.player.position.y === this.LevelEnd[0].y &&
            (this.player.position.x >= this.LevelEnd[0].x && this.player.position.x <= this.LevelEnd[1].x)
        ) {
            // Only execute these statements if the player is at the end of the level
            this.emitter.fireEvent(LevelEvent.PLAYER_ENTERED_LEVEL_END);
            console.log("player reached end");
        }

        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            switch (event.type) {
                case "restart":
                    this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
                    this.sceneManager.changeToScene(LevelSelectScene);
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
                case BattlerEvent.BATTLER_KILLED:
                    this.enemies_killed++;
                    if (this.enemies_killed == this.TotalEnemies){
                        
                    }
                    console.log("enemies killed", this.enemies_killed.toString())
                    break;
                case LevelEvent.PLAYER_ENTERED_LEVEL_END:
                    if (this.enemies_killed == this.TotalEnemies){
                        this.sceneManager.changeToScene(this.nextLevel);
                    }
                    break;
                default:
                    break;
            }
        }
        this.healthbars.forEach(healthbar => healthbar.update(deltaT));
    }

}