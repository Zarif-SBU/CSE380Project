import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";

export default class ControlScene2 extends Scene {
    protected Controls: Layer;
    protected back: any;
    protected controlsSprite: any;

    public loadScene() {
        this.load.image("controls", "hw4_assets/SceneImages/Controls_Image.png");
    }

    public startScene() {
        this.loadScene();
        const center = this.viewport.getCenter();
        this.Controls = this.addUILayer("Controls");

        // Add the controls sprite and set its position and scale
        this.controlsSprite = this.add.sprite("controls", "Controls");
        this.controlsSprite.position.set(center.x, center.y);
        this.controlsSprite.scale.set(1, 1);

        // Create the back button
        this.back = this.add.uiElement(UIElementType.BUTTON, "Controls", { position: new Vec2(center.x - 460, center.y - 320), text: "Back" });
        this.back.size.set(200, 50);
        this.back.borderWidth = 2;
        this.back.borderColor = Color.WHITE;
        this.back.backgroundColor = Color.TRANSPARENT;
        this.back.onClickEventId = "back";

        // Subscribe to the "back" event
        this.receiver.subscribe("back");
    }

    public updateScene() {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    public handleEvent(event: GameEvent): void {
        if (event.type === "back") {
            // Hide the controls sprite and back button
            this.controlsSprite.visible = false;
            this.back.visible = false;
        }
    }
}
