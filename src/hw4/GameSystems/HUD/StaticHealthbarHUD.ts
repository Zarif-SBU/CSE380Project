import Positioned from "../../../Wolfie2D/DataTypes/Interfaces/Positioned";
import Unique from "../../../Wolfie2D/DataTypes/Interfaces/Unique";
import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";

interface Health {
    get health(): number;
    get maxHealth(): number;
}

interface HealthBarOptions {
    size: Vec2;
    location: Vec2;
}

/**
 * A UI component that's suppossed to represent a healthbar
 */
export default class StaticHealthbarHUD implements Updateable {

    /** The scene and layer in the scene the healthbar is in */
    protected scene: Scene;
    protected layer: string;

    /** The GameNode that owns this healthbar */
    protected owner: Health & Positioned & Unique;

    /** The size and location of the healthbar */
    protected size: Vec2;
    protected location: Vec2;

    /** The actual healthbar (the part with color) */
    protected healthBar: Label;
    /** The healthbars background (the part with the border) */
    protected healthBarBg: Label;

    protected healthbartemp;

    public constructor(scene: Scene, owner: Health & Positioned & Unique, layer: string, options: HealthBarOptions) {
        this.scene = scene;
        this.layer = layer;
        this.owner = owner;

        this.size = options.size;
        this.location = options.location;

        this.healthBar = <Label>this.scene.add.uiElement(UIElementType.LABEL, layer, {position:this.location , text: ""});
        this.healthBar.size.copy(this.size);
        this.healthBar.backgroundColor = Color.RED;

        this.healthBarBg = <Label>this.scene.add.uiElement(UIElementType.LABEL, layer, {position:this.location, text: ""});
        this.healthBarBg.backgroundColor = Color.TRANSPARENT;
        this.healthBarBg.size.copy(this.size);
    }


    public update(deltaT: number): void {
        let scale = this.scene.getViewScale();
        this.healthBar.scale.scale(scale);
        this.healthBarBg.scale.scale(scale);
    
        let unit = this.healthBarBg.size.x / this.owner.maxHealth;
    
        // Calculate the new width of the health bar based on the current health
        let newWidth = this.healthBarBg.size.x - unit * (this.owner.maxHealth - this.owner.health);
    
        // Calculate the difference in width
        let widthDifference = this.healthBar.size.x - newWidth;
    
        // Update the size of the health bar
        this.healthBar.size.set(newWidth, this.healthBarBg.size.y);
    
        // Move the health bar to the left by half of the width difference
        this.healthBar.position.x -= widthDifference / 2;
    
        // Change the color of the health bar based on health status
        this.healthBar.backgroundColor =
            this.owner.health < this.owner.maxHealth * 1/4 ? Color.YELLOW :
            this.owner.health < this.owner.maxHealth * 3/4 ? Color.ORANGE :
            Color.RED;
    }
    

    

    get ownerId(): number { return this.owner.id; }

    set visible(visible: boolean) {
        this.healthBar.visible = visible;
        this.healthBarBg.visible = visible;
    }
    

}