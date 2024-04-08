import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import Idle from "../NPCActions/GotoAction";
import BasicFinder from "../../../GameSystems/Searching/BasicFinder";
import { BattlerActiveFilter, EnemyFilter, RangeFilter } from "../../../GameSystems/Searching/HW4Filters";
import { ClosestPositioned } from "../../../GameSystems/Searching/HW4Reducers";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import { TargetExists } from "../NPCStatuses/TargetExists";
import FalseStatus from "../NPCStatuses/FalseStatus";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import GoapAction from "../../../../Wolfie2D/AI/Goap/GoapAction";
import GoapState from "../../../../Wolfie2D/AI/Goap/GoapState";
import Battler from "../../../GameSystems/BattleSystem/Battler";
import RandomMovement from "../NPCActions/Walkaround";

export default class GuardBehavior extends NPCBehavior {

    /** The target the guard should guard */
    protected target: TargetableEntity;
    /** The range the guard should be from the target they're guarding to be considered guarding the target */
    protected range: number;

    /** Initialize the NPC AI */
    public initializeAI(owner: NPCActor, options: GuardOptions): void {
        super.initializeAI(owner, options);

        // Initialize the targetable entity the guard should try to protect and the range to the target
        this.target = options.target
        this.range = options.range;

        // Initialize guard statuses
        this.initializeStatuses();
        // Initialize guard actions
        this.initializeActions();
        // Set the guards goal
        this.goal = GuardStatuses.GOAL;

        // Initialize the guard behavior
        this.initialize();
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }

    public update(deltaT: number): void {
        super.update(deltaT);
    }

    protected initializeStatuses(): void {

        let scene = this.owner.getScene();

        // A status checking if there are any enemies at target the guard is guarding
        let enemyBattlerFinder = new BasicFinder<Battler>(() => scene.getBattlers()[0], EnemyFilter(this.owner), RangeFilter(this.target, 0, this.range*this.range))
        let enemyAtGuardPosition = new TargetExists(scene.getBattlers(), enemyBattlerFinder)
        this.addStatus(GuardStatuses.ENEMY_IN_GUARD_POSITION, enemyAtGuardPosition);

        // Add a status to check if a lasergun exists in the scene and it's visible
        // Add a status to check if the guard has a lasergun
        
        // Add the goal status 
        this.addStatus(GuardStatuses.GOAL, new FalseStatus());
    }

    protected initializeActions(): void {
        let scene = this.owner.getScene()
        // An action for guarding the guard's guard location
        let guard = new RandomMovement(this, this.owner);
        guard.targets = [this.target];
        guard.targetFinder = new BasicFinder();
        // guard.addPrecondition(GuardStatuses.HAS_WEAPON);
        guard.addEffect(GuardStatuses.GOAL);
        guard.cost = 1000;
        this.addState(GuardActions.GUARD, guard);
    }

    public override addState(stateName: GuardAction, state: GoapAction): void {
        super.addState(stateName, state);
    }

    public override addStatus(statusName: GuardStatus, status: GoapState): void {
        super.addStatus(statusName, status);
    }
}

export interface GuardOptions {
    target: TargetableEntity
    range: number;
}

export type GuardStatus = typeof GuardStatuses[keyof typeof GuardStatuses];
export const GuardStatuses = {

    ENEMY_IN_GUARD_POSITION: "enemy-at-guard-position",

    HAS_WEAPON: "has-weapon",

    LASERGUN_EXISTS: "laser-gun-exists",

    GOAL: "goal"

} as const;

export type GuardAction = typeof GuardActions[keyof typeof GuardActions];
export const GuardActions = {

    PICKUP_LASER_GUN: "pickup-lasergun",

    SHOOT_ENEMY: "shoot-enemy",

    GUARD: "guard",

} as const;

