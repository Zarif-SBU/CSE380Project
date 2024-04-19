import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import ControlScene from "../ControlScene";
import LevelSelectScene from "./LevelSelectScreen";
import Story from "./Story";

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private about: Layer;
    private control: Layer;

    public loadScene(){
        this.load.image("menu","/dist/hw4_assets/SceneImages/Menu_Image.png");
    }
        
    public startScene(){
        this.loadScene();
        const center = this.viewport.getCenter();
        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");
        let x = this.add.sprite("menu", "mainMenu");
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);


        

        const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 100), text: "Play"});
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = "play";

        const astar = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y), text: "Level Select"});
        astar.size.set(200, 50);
        astar.borderWidth = 2;
        astar.borderColor = Color.WHITE;
        astar.backgroundColor = Color.TRANSPARENT;
        astar.onClickEventId = "levels";

        const guard = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 100), text: "Controls"});
        guard.size.set(200, 50);
        guard.borderWidth = 2;
        guard.borderColor = Color.WHITE;
        guard.backgroundColor = Color.TRANSPARENT;
        guard.onClickEventId = "controls";

        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("levels");
        this.receiver.subscribe("controls");
    }

    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "play": {
                this.sceneManager.changeToScene(Story);
                break;
            }
            case "levels": {
                this.sceneManager.changeToScene(LevelSelectScene);
                break;
            }
            case "controls": {
                this.sceneManager.changeToScene(ControlScene);
                break;
            }
        }
    }
}