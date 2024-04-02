import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import CharacterActor from "../../Actors/CharacterActor";
import { ItemEvent } from "../../Events";
import Inventory from "../../GameSystems/ItemSystem/Inventory";
import Item from "../../GameSystems/ItemSystem/Item";
import CharacterController from "./CharacterController";
import { CharacterStateType, Dead, Idle, Moving } from "./CharacterStates/CharacterState";

/**
 * The AI that controls the Character. The Characters AI has been configured as a Finite State Machine (FSM)
 * with 4 states; Idle, Moving, Invincible, and Dead.
 */
export default class CharacterAI extends StateMachineAI implements AI {

    /** The GameNode that owns this AI */
    public owner: CharacterActor;
    /** A set of controls for the Character */
    public controller: CharacterController;
    /** The inventory object associated with the Character */
    public inventory: Inventory;
    /** The Characters held item */
    public item: Item | null;
    
    public initializeAI(owner: CharacterActor, opts: Record<string, any>): void {
        this.owner = owner;
        this.controller = new CharacterController(owner);

        // Add the Characters states to it's StateMachine
        this.addState(CharacterStateType.IDLE, new Idle(this, this.owner));
        this.addState(CharacterStateType.MOVING, new Moving(this, this.owner));
        this.addState(CharacterStateType.DEAD, new Dead(this, this.owner));
        
        // Initialize the Characters state to Idle
        this.initialize(CharacterStateType.IDLE);
    }

    public activate(options: Record<string, any>): void { }

    public update(deltaT: number): void {
        super.update(deltaT);
    }

    public destroy(): void {}

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case ItemEvent.LASERGUN_FIRED: {
                this.handleLaserFiredEvent(event.data.get("actorId"), event.data.get("to"), event.data.get("from"));
                break;
            }
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }

    protected handleLaserFiredEvent(actorId: number, to: Vec2, from: Vec2): void {
        if (this.owner.id !== actorId && this.owner.collisionShape !== undefined ) {
            if (this.owner.collisionShape.getBoundingRect().intersectSegment(to, from.clone().sub(to)) !== null) {
                this.owner.health -= 1;
            }
        }
    }


}