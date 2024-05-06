import StateMachineGoapAI from "../../../Wolfie2D/AI/Goap/StateMachineGoapAI";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Line from "../../../Wolfie2D/Nodes/Graphics/Line";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import NPCActor from "../../Actors/NPCActor";
import { PlayerEvent } from "../../Events";
import NPCAction from "./NPCActions/NPCAction";


/**
 * An abstract implementation of behavior for an NPC. Each concrete implementation of the
 * NPCBehavior class should define some new behavior for an NPCActor. 
 */
export default abstract class NPCBehavior extends StateMachineGoapAI<NPCAction>  {

    protected override owner: NPCActor;

    public initializeAI(owner: NPCActor, options: Record<string, any>): void {
        this.owner = owner;
        this.receiver.subscribe(PlayerEvent.PLAYER_ATTACKING);
    }

    public activate(options: Record<string, any>): void {}

    public update(deltaT: number): void {
        super.update(deltaT);
    }

    /**
     * @param event the game event
     */
    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case PlayerEvent.PLAYER_ATTACKING: {
                // console.log("Catching and handling lasergun fired event!!!");
                this.handlePlayerAttack(event.data.get("actorId"), event.data.get("center"), event.data.get("hh"), event.data.get("hw"));
            break;
            }
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }
    handlePlayerAttack(actorId: number, center: Vec2, SlashCollision: AABB, hw: number) {
        if( this.owner != null && this.owner.collisionShape.getBoundingRect().overlapArea(SlashCollision) > 0 && !this.owner.animation.isPlaying("DAMAGED_RIGHT")) {
            this.owner.animation.playIfNotAlready("DAMAGED_RIGHT");
            // if(this.owner.health - 1 == 0) {
                // this.owner.destroy();
            // } else {
                this.owner.health -= 1;
            // }
        }
    }
    
}