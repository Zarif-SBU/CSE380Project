import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Timer from "../../../Wolfie2D/Timing/Timer";
import SlashController from "./SlashController";
import SlashActor from "../../Actors/SlashActor";
import { SlashStateType } from "./SlashStates/SlashState";
import Attacking from "./SlashStates/Attacking";
/**
 * The AI that controls the player. The players AI has been configured as a Finite State Machine (FSM)
 * with 4 states; Idle, Moving, Invincible, and Dead.
 */

export default class SlashAI extends StateMachineAI implements AI {
    public timer: Timer;
    /** The GameNode that owns this AI */
    public owner: SlashActor;
    /** A set of controls for the player */
    public controller: SlashController;
    /** The inventory object associated with the player */
    /** The players held item */
    

    public initializeAI(owner: SlashActor, opts: Record<string, any>): void {
        this.timer = new Timer(2000);
        this.owner = owner;
        this.controller = new SlashController(owner);

        // Add the players states to it's StateMachine
        this.addState(SlashStateType.ATTACKING, new Attacking(this, this.owner));
        // Initialize the players state to Idle
        this.initialize(SlashStateType.ATTACKING);
    }

    public activate(options: Record<string, any>): void { }

    public update(deltaT: number): void {
        super.update(deltaT);
    }
}

