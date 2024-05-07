import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Input from "../../../Wolfie2D/Input/Input";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import ThankYou from "./ThankYou";

export default class EndingText extends Scene {
    protected end_text : Layer;
    public loadScene(){
        this.load.image("ending","hw4_assets/SceneImages/EndingText.png");
        this.load.audio("level_music", "hw4_assets/Audio/FillerMusic.mp3")
    }

    public startScene(){
        this.loadScene();
        const center = this.viewport.getCenter();
        this.end_text = this.addUILayer("end_text");
        let x = this.add.sprite("ending", "end_text")
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);

        const text1 = "Press Anywhere to Continue";
        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "end_text", {position: new Vec2(center.x+360, center.y+300), text: text1});
        line1.textColor = Color.WHITE;
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }
    public updateScene(){
        if(Input.isMouseJustPressed()){
            this.sceneManager.changeToScene(ThankYou);
        }
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    public handleEvent(event: GameEvent): void {

    }
}