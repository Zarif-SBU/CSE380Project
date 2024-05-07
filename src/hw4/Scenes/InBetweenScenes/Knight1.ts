import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import Dragon1 from "./Dragon1";

export default class Knight1 extends Scene {
    protected Knight1 : Layer;
    public loadScene(){
        this.load.image("knight","hw4_assets/SceneImages/Knight_Dialogue.png");
    }

    public startScene(){
        this.loadScene();
        const center = this.viewport.getCenter();
        this.Knight1 = this.addUILayer("Knight1");
        let x = this.add.sprite("knight", "Knight1")
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);

        const text1 = "Press Anywhere to Continue"
        const text2= '"What have you done to them, dragon?'
        const text3 = 'Villages burned, people slaughtered... Your rampage ends here!"'
        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "Knight1", {position: new Vec2(center.x+360, center.y+300), text: text1});
        line1.textColor = Color.WHITE;

        const line2= <Label>this.add.uiElement(UIElementType.LABEL, "Knight1", {position: new Vec2(center.x, center.y+170), text: text2});
        line2.textColor = Color.WHITE;
        const line3= <Label>this.add.uiElement(UIElementType.LABEL, "Knight1", {position: new Vec2(center.x, center.y+220), text: text3});
        line3.textColor = Color.WHITE;

    }
    public updateScene(){
        if(Input.isMouseJustPressed()){
            this.sceneManager.changeToScene(Dragon1);
        }
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    public handleEvent(event: GameEvent): void {

    }
}