import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import SlashState, { SlashAnimationType } from "./SlashState";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class Attacking extends SlashState {
    handleInput(event: GameEvent): void {
        throw new Error("Method not implemented.");
    }

    public override onEnter(options: Record<string, any>): void {
        // this.parent.owner.animation.playIfNotAlready(SlashAnimationType.RIGHT_SLASH, true);
    }

    public override update(deltaT: number): void {
        super.update(deltaT);
    }

    public override onExit(): Record<string, any> { 
        return {}; 
    }
    
}