import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Battler from "../GameSystems/BattleSystem/Battler";
import ControlScene2 from "./BeginningScenes/ControlScene";
import MainMenu from "./BeginningScenes/MainMenu";
import lvl1Scene from "./Levels/lvl1Scene";


export default abstract class HW4Scene extends Scene {
    public level: number;
    protected PauseMenu: Layer;
    
    public abstract getBattlers(): Battler[];

    public abstract getWalls(): OrthogonalTilemap;


    public abstract isTargetVisible(position: Vec2, target: Vec2): boolean;
    
    public loadScene() {
        this.load.image("test", "/dist/hw4_assets/SceneImages/BrownBackground.png");
        this.receiver.subscribe("quit")
    }
    public startScene() {
        //this.loadScene();
        const center = this.viewport.getCenter();
        console.log(center)
        this.PauseMenu = this.addUILayer("PauseMenu")
        let x = this.add.sprite("test", "PauseMenu")
        x.position.set(center.x, center.y);
        x.scale.set(5,5);

        this.createButton("Restart", new Vec2(600,250), "restart");
        this.createButton("Controls", new Vec2(600, 350), "controls");
        this.createButton("Quit", new Vec2(600, 450), "quit");
        
    }

    private getLevel(levelNumber: number) {
        switch (levelNumber) {
            case 1:
                //return lvl1Scene;
                this.sceneManager.changeToScene(lvl1Scene);
            default:
                break;
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

    public handleEvent(event: GameEvent): void {
        switch (event.type) {
            //case "restart":
                
                //break;
            case "controls":
                this.sceneManager.changeToScene(ControlScene2);
                break;
            case "quit":
                this.sceneManager.changeToScene(MainMenu);
                break;
            default:
                break;
        }
    }
}