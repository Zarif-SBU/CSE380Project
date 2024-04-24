import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

export default class ControlScene2 extends Scene {
    protected Controls : Layer;

    public loadScene(){
        this.load.image("controls","hw4_assets/SceneImages/Controls_Image.png");
        this.load.audio("level_music", "hw4_assets/Audio/FillerMusic.mp3")
        this.load.audio("select", "hw4_assets/Audio/select.mp3");

    }

    public startScene(){
        this.loadScene();
        const center = this.viewport.getCenter();
        this.Controls = this.addUILayer("Controls")
        let x = this.add.sprite("controls", "Controls")
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);

        const back = this.add.uiElement(UIElementType.BUTTON, "Controls", {position: new Vec2(center.x-460, center.y - 320), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = "back";

        this.receiver.subscribe("back");
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "select", loop: false, holdReference: true});
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});

    }
    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    public handleEvent(event: GameEvent): void {
        if (event.type === "back"){
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "select", loop: false, holdReference: true});
            this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
            this.sceneManager.changeToScene(MainMenu);
        }
    }
}