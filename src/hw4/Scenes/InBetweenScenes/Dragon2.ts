import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Input from "../../../Wolfie2D/Input/Input";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import Dragon1 from "./Dragon1";
//import lvl6Scene from "../Levels/lvl6Scene";
import lvl1Scene from "../Levels/lvl6Scene";
import lvl5Scene from "../Levels/lvl5Scene";
//import TextScenecopy from "../BeginningScenes/TextScenecopy";
import LevelSelectScreencopy from "../BeginningScenes/LevelSelectScreencopy";
import lvl6Scene from "../Levels/lvl6Scene";
import MainMenu from "../BeginningScenes/MainMenu";
import LevelSelectScreen from "../BeginningScenes/LevelSelectScreen";

export default class Dragon2 extends Scene {
    protected Dragon2 : Layer;
    public loadScene(){
        this.load.image("dragon","hw4_assets/SceneImages/Dragon_Dialogue.png");
        this.load.audio("growl", "hw4_assets/Audio/SoundEffects/DragonGrowl.mp3")
    }

    public startScene(){
        this.loadScene();
        const center = this.viewport.getCenter();
        this.Dragon2 = this.addUILayer("Dragon2");
        let x = this.add.sprite("dragon", "Dragon2")
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);

        const text1 = "Press Anywhere to Continue";
        const text2= '"You think you can challenge me, little knight? '
        const text3 = 'Prepare to meet your end!"'
        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "Dragon2", {position: new Vec2(center.x+360, center.y+300), text: text1});
        line1.textColor = Color.WHITE;

        const line2= <Label>this.add.uiElement(UIElementType.LABEL, "Dragon2", {position: new Vec2(center.x, center.y+170), text: text2});
        line2.textColor = Color.WHITE;
        const line3= <Label>this.add.uiElement(UIElementType.LABEL, "Dragon2", {position: new Vec2(center.x, center.y+220), text: text3});
        line3.textColor = Color.WHITE;

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "growl", loop: false, holdReference: true});
    }
    public updateScene(){
        if(Input.isMouseJustPressed()){
            this.sceneManager.changeToScene(LevelSelectScreen);
        } 
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        } 
    }
    public handleEvent(event: GameEvent): void {

    }
}