import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import MainMenu from "../BeginningScenes/MainMenu";

export default class ThankYou extends Scene {
    protected thank_you : Layer;
    public loadScene(){
        this.load.image("thanks","hw4_assets/SceneImages/ThankYou.png");
    }

    public startScene(){
        this.loadScene();
        const center = this.viewport.getCenter();
        this.thank_you = this.addUILayer("thank_you");
        let x = this.add.sprite("thanks", "thank_you")
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);

        const levelSelect = this.add.uiElement(UIElementType.BUTTON, "thank_you", {position: new Vec2(center.x, center.y + 250), text: "Play Again"});
        levelSelect.size.set(200, 50);
        levelSelect.borderWidth = 2;
        levelSelect.borderColor = Color.WHITE;
        levelSelect.backgroundColor = Color.TRANSPARENT;
        levelSelect.onClickEventId = "restart";
        
        this.receiver.subscribe("restart");

    }
    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    public handleEvent(event: GameEvent): void {
        if(event.type == "restart"){
            this.sceneManager.changeToScene(MainMenu);
        
        }
    }
}