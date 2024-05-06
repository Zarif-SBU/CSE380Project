import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import Slash from "./Slash";
import Attacking from "./SlashStates/Attacking";
export default class SlashController{
    protected owner: AnimatedSprite;
    private currentFacingDirection: Vec2 = new Vec2(0, -1);
    

    constructor(owner: AnimatedSprite) {
        this.owner = owner;
    }
}