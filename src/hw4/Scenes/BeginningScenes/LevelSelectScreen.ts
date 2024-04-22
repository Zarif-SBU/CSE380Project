import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import lvl1Scene from "../Levels/lvl1Scene";
import lvl2Scene from "../Levels/lvl2Scene";
import lvl3Scene from "../Levels/lvl3Scene";
import lvl4Scene from "../Levels/lvl4Scene";
import lvl5Scene from "../Levels/lvl5Scene";
import MainMenu from "./MainMenu";

export default class LevelSelectScene extends Scene {
    protected levelSelect : Layer;

    public loadScene(){
        this.load.image("levels","/dist/hw4_assets/SceneImages/BrownBackground.png");
        
    }

    public startScene(){
        this.loadScene();
        const center = this.viewport.getCenter();
        this.levelSelect = this.addUILayer("levelSelect")
        let x = this.add.sprite("levels", "levelSelect")
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);

        const back = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x-460, center.y - 320), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = "back";
        
        this.createButton("Level 1", new Vec2(center.x - 460, center.y), "level1");
        this.createButton("Level 2", new Vec2(center.x - 230, center.y), "level2");
        this.createButton("Level 3", new Vec2(center.x , center.y), "level3");
        this.createButton("Level 4", new Vec2(center.x + 230, center.y), "level4");
        this.createButton("Level 5", new Vec2(center.x + 460, center.y), "level5");

    }

    private createButton(text: string, position: Vec2, eventId: string): void {
        const button = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {
            position: position,
            text: text
        });

        button.size.set(200, 300);
        button.borderWidth = 4;
        button.borderColor = Color.WHITE;
        button.backgroundColor = Color.TRANSPARENT;
        button.onClickEventId = eventId;

        this.receiver.subscribe(eventId);
    }

    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    public handleEvent(event: GameEvent): void {
        switch (event.type) {
            case "back":
                this.sceneManager.changeToScene(MainMenu);
                break;
            case "level1":
                this.sceneManager.changeToScene(lvl1Scene);
                break;
            case "level2":
                this.sceneManager.changeToScene(lvl2Scene);
                break;
            case "level3":
                this.sceneManager.changeToScene(lvl3Scene);
                break;
            case "level4":
                this.sceneManager.changeToScene(lvl4Scene);
                break;
            case "level5":
            this.sceneManager.changeToScene(lvl5Scene);
            break;
            default:
                break;
        }
    }
    
}