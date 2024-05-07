import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import ThankYou from "./ThankYou";

export default class EndingText extends Scene {
    protected end_text : Layer;
    public loadScene(){
        this.load.image("ending","hw4_assets/SceneImages/EndingText.png");
    }

    public startScene(){
        this.loadScene();
        const center = this.viewport.getCenter();
        this.end_text = this.addUILayer("end_text");
        let x = this.add.sprite("defeat", "end_text")
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);

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