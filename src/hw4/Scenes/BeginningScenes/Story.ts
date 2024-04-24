import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import TextScene from "./TextScene";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
export default class Story extends Scene {
    protected start_story : Layer;

    public loadScene(){
        this.load.image("start","hw4_assets/SceneImages/StartStory.png");
        this.load.audio("select", "hw4_assets/Audio/select.mp3");
    }

    public startScene(){
        this.loadScene();
        const center = this.viewport.getCenter();
        this.start_story = this.addUILayer("start_story")
        let x = this.add.sprite("start", "start_story")
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "select", loop: false, holdReference: true});

    }
    public updateScene(){
        if(Input.isMouseJustPressed()){
            this.sceneManager.changeToScene(TextScene);
        }
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    public handleEvent(event: GameEvent): void {

    }
}