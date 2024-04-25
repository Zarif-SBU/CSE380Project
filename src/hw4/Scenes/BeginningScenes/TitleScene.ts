import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

export default class TitleScene extends Scene {
    protected splash_screen : Layer;

    public loadScene(){
        this.load.image("splash","hw4_assets/SceneImages/Splash.png");
        
    }

    public startScene(){
        this.loadScene();
        const center = this.viewport.getCenter();
        this.splash_screen = this.addUILayer("splash_screen")
        let x = this.add.sprite("splash", "splash_screen")
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);

        const text1 = "Press Anywhere to Start";
        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "splash_screen", {position: new Vec2(center.x, center.y-330), text: text1});
        line1.textColor = Color.WHITE;

    }
    public updateScene(){
        if(Input.isMouseJustPressed()){
            this.sceneManager.changeToScene(MainMenu);
        }
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    public handleEvent(event: GameEvent): void {

    }
}