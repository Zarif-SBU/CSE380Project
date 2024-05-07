import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import BigReveal from "./BigReveal";

export default class SavingScene extends Scene {
    protected saving_scene : Layer;
    public loadScene(){
        this.load.image("saving","hw4_assets/SceneImages/Saving.png");
    }

    public startScene(){
        this.loadScene();
        const center = this.viewport.getCenter();
        this.saving_scene = this.addUILayer("saving_scene");
        let x = this.add.sprite("saving", "saving_scene")
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);

        const text1 = "Press Anywhere to Continue";
        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "saving_scene", {position: new Vec2(center.x+360, center.y-330), text: text1});
        line1.textColor = Color.BLACK;
    }
    public updateScene(){
        if(Input.isMouseJustPressed()){
            this.sceneManager.changeToScene(BigReveal);
        }
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    public handleEvent(event: GameEvent): void {

    }
}