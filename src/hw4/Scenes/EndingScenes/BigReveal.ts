import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Input from "../../../Wolfie2D/Input/Input";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import EndingText from "./EndingText";

export default class BigReveal extends Scene {
    protected big_reveal : Layer;
    public loadScene(){
        this.load.image("reveal","hw4_assets/SceneImages/BigReveal.png");
        this.load.audio("reveal", "hw4_assets/Audio/SoundEffects/dogReveal.mp3")
    }

    public startScene(){
        this.loadScene();
        const center = this.viewport.getCenter();
        this.big_reveal = this.addUILayer("big_reveal");
        let x = this.add.sprite("reveal", "big_reveal")
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);

        const text1 = "Press Anywhere to Continue";
        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "big_reveal", {position: new Vec2(center.x-200, center.y-310), text: text1});
        line1.textColor = Color.BLACK;
        this.emitter.fireEvent(GameEventType.STOP_SOUND,{key:"suspense"})
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "reveal", loop: false, holdReference: true});
        
    }
    public updateScene(){
        if(Input.isMouseJustPressed()){
            this.sceneManager.changeToScene(EndingText);
        }
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    public handleEvent(event: GameEvent): void {

    }
}