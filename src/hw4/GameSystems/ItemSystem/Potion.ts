import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Item from "./item";

export default class Potion extends Item {

    public constructor(sprite: Sprite) {
        super(sprite);
        // You don't need to initialize any additional properties
    }

    // You can add any specific methods or functionalities for the chest here
    // For example:
    public open(): void {
        // Implement the logic for opening the chest
    }
}
