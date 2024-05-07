import IdleAction from "../NPCActions/GotoAction";
import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import GoalReached from "../NPCStatuses/FalseStatus";
import Idle from "../NPCActions/GotoAction";
import BasicFinder from "../../../GameSystems/Searching/BasicFinder";
import { AllyFilter, BattlerActiveFilter, BattlerGroupFilter, BattlerHealthFilter, EnemyFilter, RangeFilter } from "../../../GameSystems/Searching/HW4Filters";
import { ClosestPositioned } from "../../../GameSystems/Searching/HW4Reducers";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import { TargetExists } from "../NPCStatuses/TargetExists";
import FalseStatus from "../NPCStatuses/FalseStatus";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import GoapAction from "../../../../Wolfie2D/AI/Goap/GoapAction";
import GoapState from "../../../../Wolfie2D/AI/Goap/GoapState";
import Battler from "../../../GameSystems/BattleSystem/Battler";
import RandomMovement from "../NPCActions/Walkaround";
import AttackPlayer from "../NPCActions/AttackPlayer";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Position from "../../../GameSystems/Targeting/Position";
import { EaseFunctionType } from "../../../../Wolfie2D/Utils/EaseFunctions";
import MoveToPlayer from "../NPCActions/MoveToPlayer";
import WolfAttack from "../NPCActions/WolfAttack";
import { PlayerEvent } from "../../../Events";
import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
/**
 * Idle behavior for an NPC. The idle behavior can be given to an NPC to tell it to do... nothing!
 */
export default class DragonBehavior extends NPCBehavior  {

    /** The GameNode that owns this NPCGoapAI */
    protected override owner: NPCActor;
    
    /** Initialize the NPC AI */
    public initializeAI(owner: NPCActor, opts: Record<string, any>): void {
        this.owner = owner;
        this.receiver.subscribe(PlayerEvent.PLAYER_ATTACKING);


        // Add the goal status
        this.addStatus("goal", new GoalReached());

        // Add the idle action
        let idle = new IdleAction(this, this.owner);
        idle.addEffect("goal");
        idle.cost = 100;
        this.addState("idle", idle);

        // Set the goal to idle
        this.goal = "goal";
    
        this.initialize();
        // Initialize the targetable entity the guard should try to protect and the range to the target
        // Initialize guard statuses
        //this.initializeStatuses();
        // Initialize guard actions
        //this.initializeActions();
        // Set the guards goal
        //this.goal = DragonStatuses.GOAL;
        
        // Initialize the guard behavior
        //this.initialize();
    }
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
    public update(deltaT: number): void {
        super.update(deltaT);
        if(!this.owner.animation.isPlaying("DAMAGE") && !this.owner.animation.isPlaying("SUMMON") && !this.owner.animation.isPlaying("DIZZY") && !this.owner.animation.isPlaying("WIND") && !this.owner.animation.isPlaying("FIREBREATH") && !this.owner.animation.isPlaying("FIREBREATH") ) {
            this.owner.animation.playIfNotAlready("IDLE")
        }

    }

    handlePlayerAttack(actorId: number, center: Vec2, SlashCollision: AABB, hw: number) {
        if( this.owner != null && this.owner.collisionShape.getBoundingRect().overlapArea(SlashCollision) > 0 && !this.owner.animation.isPlaying("DAMAGE") && !this.owner.animation.isPlaying("SUMMON")) {
            this.owner.animation.playIfNotAlready("DAMAGE");
            // if(this.owner.health - 1 == 0) {
                // this.owner.destroy();
            // } else {
                this.owner.health -= 1;
                if(this.owner.health < 0) {
                    this.owner.health = 0;
                }
            // }
        }
    }
    protected initializeStatuses(): void {


        let scene = this.owner.getScene();

        

        this.addStatus(DragonStatuses.GOAL, new FalseStatus());


    }
   
    protected initializeActions(): void {

        let scene = this.owner.getScene();

    }


    
}
export interface DragonOptions {
    target: TargetableEntity
    range: number;
}


export type DragonStatus = typeof DragonStatuses[keyof typeof DragonStatuses];
export const DragonStatuses = {
    SHIELD_ON: "SHIELD_ON",

    SHIELD_OFF: "SHIELD_OFF",

    PHASE1:"PHASE1",

    PHASE2:"PHASE2",

    PHASE3:"PHASE3",

    PHASE4:"PHASE4",

    GOAL: "goal"


} as const;


export type DragonAction = typeof DragonActions[keyof typeof DragonActions];
export const DragonActions = {
    SUMMON: "summon",

    FIREBREATH: "firebreath",

    DIZZY: "dizzy",

    WIND: "wind",

    IDLE: "idle",


} as const;