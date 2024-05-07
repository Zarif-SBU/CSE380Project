import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import Dragon2 from "./Dragon2";

export default class Knight2 extends Scene {
    protected Knight2 : Layer;
    public loadScene(){
        this.load.image("knight","hw4_assets/SceneImages/Knight_Dialogue.png");

    }

    public startScene(){
        this.loadScene();
        const center = this.viewport.getCenter();
        this.Knight2 = this.addUILayer("Knight2");
        let x = this.add.sprite("knight", "Knight2")
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);

        const text1 = "Press Anywhere to Continue";
        const text2= '" Insignificant?! You dare belittle the lives of innocents?'
        const text3 = 'I will make you answer for your crimes!"'
        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "Knight2", {position: new Vec2(center.x+360, center.y+300), text: text1});
        line1.textColor = Color.WHITE;

        const line2= <Label>this.add.uiElement(UIElementType.LABEL, "Knight2", {position: new Vec2(center.x, center.y+170), text: text2});
        line2.textColor = Color.WHITE;
        const line3= <Label>this.add.uiElement(UIElementType.LABEL, "Knight2", {position: new Vec2(center.x, center.y+220), text: text3});
        line3.textColor = Color.WHITE;

    }
    public updateScene(){
        if(Input.isMouseJustPressed()){
            this.sceneManager.changeToScene(Dragon2);
        }
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    public handleEvent(event: GameEvent): void {

    }
}