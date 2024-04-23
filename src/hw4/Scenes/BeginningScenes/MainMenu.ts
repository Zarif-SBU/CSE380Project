import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import ControlScene from "./ControlScene";
import LevelSelectScene from "./LevelSelectScreen";
import Story from "./Story";


export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private about: Layer;
    private control: Layer;
    private musicPlaying: boolean = false;
    
    public loadScene(){
        
        this.load.image("menu","/dist/hw4_assets/SceneImages/Menu_Image.png");
        this.load.audio("level_music", "/dist/hw4_assets/Audio/FillerMusic.mp3")
        this.load.audio("select", "/dist/hw4_assets/Audio/select.mp3");
    }
    
    
    public startScene(){
        this.loadScene();
        const center = this.viewport.getCenter();
        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");
        let x = this.add.sprite("menu", "mainMenu");
        x.position = new Vec2(center.x, center.y);
        x.scale.set(1,1);


        

        const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 100), text: "Play"});
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color.WHITE;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = "play";
        

        const levelSelect = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y), text: "Level Select"});
        levelSelect.size.set(200, 50);
        levelSelect.borderWidth = 2;
        levelSelect.borderColor = Color.WHITE;
        levelSelect.backgroundColor = Color.TRANSPARENT;
        levelSelect.onClickEventId = "levels";

        const control = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 100), text: "Controls"});
        control.size.set(200, 50);
        control.borderWidth = 2;
        control.borderColor = Color.WHITE;
        control.backgroundColor = Color.TRANSPARENT;
        control.onClickEventId = "controls";

        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("levels");
        this.receiver.subscribe("controls");
        this.receiver.subscribe(GameEventType.PLAY_MUSIC);
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "select", loop: false, holdReference: true});
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});

    }
    
    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    
    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "play": {
                this.sceneManager.changeToScene(Story);
                console.log("Playing select sound for 'play'");
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "select", loop: false, holdReference: false});
                break;
            }
            case "levels": {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
                this.sceneManager.changeToScene(LevelSelectScene);
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "select", loop: false, holdReference: false});
                break;
            }
            case "controls": {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
                this.sceneManager.changeToScene(ControlScene);
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "select", loop: false, holdReference: false});
                break;
            }
        }
    }
}