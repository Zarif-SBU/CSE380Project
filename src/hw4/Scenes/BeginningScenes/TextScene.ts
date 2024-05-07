import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Input from "../../../Wolfie2D/Input/Input";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import lvl6Scene from "../Levels/lvl6Scene";

export default class TextScene extends Scene {
    protected text_scene : Layer;

    public loadScene(){
        this.load.image("text","hw4_assets/SceneImages/StoryContinued.png");
        
    }

    public startScene(){
        this.loadScene();
        const center = this.viewport.getCenter();
        this.text_scene = this.addUILayer("text_scene")
        let x = this.add.sprite("text", "text_scene")
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);

        const text1 = "Press Anywhere to Continue . . .";
        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "text_scene", {position: new Vec2(center.x+360, center.y+330), text: text1});
        line1.textColor = Color.WHITE;

    }
    public updateScene(){
        if(Input.isMouseJustPressed()){
            this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
            this.sceneManager.changeToScene(lvl6Scene);
        }
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    public handleEvent(event: GameEvent): void {

    }
}