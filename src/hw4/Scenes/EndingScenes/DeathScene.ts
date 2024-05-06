import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import MainMenu from "../BeginningScenes/MainMenu";

export default class DeathScene extends Scene {
    protected death_screen : Layer;

    public loadScene(){
        this.load.image("death","hw4_assets/SceneImages/DeathScreen.png");
        this.load.audio("death_music", "hw4_assets/Audio/deathMusic.mp3")
    }

    public startScene(){
        this.loadScene();
        this.receiver.subscribe(GameEventType.PLAY_MUSIC);
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key:"level_music"});
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "death_music", loop: false, holdReference: true});
        const center = this.viewport.getCenter();
        this.death_screen = this.addUILayer("death_screen")
        let x = this.add.sprite("death", "death_screen")
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);

        const levelSelect = this.add.uiElement(UIElementType.BUTTON, "death_screen", {position: new Vec2(center.x, center.y + 50), text: "Restart"});
        levelSelect.size.set(200, 50);
        levelSelect.borderWidth = 2;
        levelSelect.borderColor = Color.WHITE;
        levelSelect.backgroundColor = Color.TRANSPARENT;
        levelSelect.onClickEventId = "restart";
        
        this.receiver.subscribe("restart");

    }
    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    public handleEvent(event: GameEvent): void {
        if(event.type == "restart"){
            this.sceneManager.changeToScene(MainMenu);
        
        }
    }
}