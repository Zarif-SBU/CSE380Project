import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import CharacterAI from "../CharacterAI";


export enum CharacterAnimationType {
    IDLE = "IDLE"
}


export enum CharacterStateType {
    IDLE = "IDLE",
    ATTACKING = "ATTACKING",
    MOVING = "MOVING",
    DEAD = "DEAD"
}

export default abstract class CharacterState extends State {

    protected parent: CharacterAI;
    protected owner: CharacterActor;

    public constructor(parent: CharacterAI, owner: CharacterActor) {
        super(parent);
        this.owner = owner;
    }

    public override onEnter(options: Record<string, any>): void {}
    public override onExit(): Record<string, any> { return {}; }
    public override update(deltaT: number): void {

        // Move the Character
        this.parent.owner.move(this.parent.controller.moveDir);

    }

    public override handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                throw new Error(`Unhandled event of type ${event.type} caught in CharacterState!`);
            }
        }
    }

}

import CharacterActor from "../../../Actors/CharacterActor";
import Dead from "./Dead";
import Idle from "./Idle";
import Moving from "./Moving";
export { Dead, Idle, Moving };

