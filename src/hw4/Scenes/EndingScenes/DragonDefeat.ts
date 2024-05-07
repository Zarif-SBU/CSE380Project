import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Input from "../../../Wolfie2D/Input/Input";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import SavingScene from "./SavingScene";

export default class Dragon_Defeat extends Scene {
    protected dragon_defeated : Layer;
    public loadScene(){
        this.load.image("defeat","hw4_assets/SceneImages/Dragon_Dialogue.png");
        this.load.audio("growl", "hw4_assets/Audio/SoundEffects/DragonGrowl.mp3")
    }

    public startScene(){
        this.loadScene();
        const center = this.viewport.getCenter();
        this.dragon_defeated = this.addUILayer("dragon_defeated");
        let x = this.add.sprite("defeat", "dragon_defeated")
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);

        const text1 = "Press Anywhere to Continue";
        const text2= '"You may have defeated us this time, but we will be back for you.'
        const text3 = 'Our vengeance shall be relentless, and you will tremble before our wrath."'
        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "dragon_defeated", {position: new Vec2(center.x+360, center.y+300), text: text1});
        line1.textColor = Color.WHITE;

        const line2= <Label>this.add.uiElement(UIElementType.LABEL, "dragon_defeated", {position: new Vec2(center.x, center.y+170), text: text2});
        line2.textColor = Color.WHITE;
        const line3= <Label>this.add.uiElement(UIElementType.LABEL, "dragon_defeated", {position: new Vec2(center.x, center.y+220), text: text3});
        line3.textColor = Color.WHITE;

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "growl", loop: false, holdReference: true});
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