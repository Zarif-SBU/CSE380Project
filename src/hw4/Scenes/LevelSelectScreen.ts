import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
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

        this.receiver.subscribe("back");

    }
    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    public handleEvent(event: GameEvent): void {
        if (event.type === "back"){
            this.sceneManager.changeToScene(MainMenu);
        }
    }
}