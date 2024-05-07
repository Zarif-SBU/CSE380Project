import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import SavingScene from "./SavingScene";

export default class Dragon_Defeat extends Scene {
    protected dragon_defeated : Layer;
    public loadScene(){
        this.load.image("defeat","hw4_assets/SceneImages/Dragon_Dialogue.png");
    }

    public startScene(){
        this.loadScene();
        const center = this.viewport.getCenter();
        this.dragon_defeated = this.addUILayer("dragon_defeated");
        let x = this.add.sprite("defeat", "dragon_defeated")
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);

    }
    public updateScene(){
        if(Input.isMouseJustPressed()){
            this.sceneManager.changeToScene(SavingScene);
        }
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    public handleEvent(event: GameEvent): void {

    }
}