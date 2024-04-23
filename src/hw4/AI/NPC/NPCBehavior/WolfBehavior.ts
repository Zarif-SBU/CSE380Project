import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import Idle from "../NPCActions/GotoAction";
import BasicFinder from "../../../GameSystems/Searching/BasicFinder";
import { BattlerActiveFilter, BattlerGroupFilter, EnemyFilter, RangeFilter } from "../../../GameSystems/Searching/HW4Filters";
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
import SlimeAttack from "../NPCActions/SlimeAttack";
import MoveToPlayer from "../NPCActions/MoveToPlayer";
import WolfAttack from "../NPCActions/WolfAttack";

export default class Wolfbehavior extends NPCBehavior {


    /** The target the guard should guard */
    protected target: TargetableEntity;
    /** The range the guard should be from the target they're guarding to be considered guarding the target */
    protected range: number;


    /** Initialize the NPC AI */
    public initializeAI(owner: NPCActor, options: DogOptions): void {
        super.initializeAI(owner, options);
        // Initialize the targetable entity the guard should try to protect and the range to the target
        this.target = options.target;
        this.range = options.range;


        // Initialize guard statuses
        this.initializeStatuses();
        // Initialize guard actions
        this.initializeActions();
        // Set the guards goal
        this.goal = DogStatuses.GOAL;
        
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
        // if(this.owner.position == this.target.position) {
        //     const randomAngle = Math.random() * Math.PI * 2;
        //     const randomDirection = new Vec2(Math.cos(randomAngle), Math.sin(randomAngle));
        //     const randomDistance = Math.random() * 200;
        //     // console.log("ddsadsa", this.owner.spawnpoint.clone().add(randomDirection.scaled(randomDistance)));
        //     this.target = this.owner.spawnpoint.clone().add(randomDirection.scaled(randomDistance));
        // }
    }


    protected initializeStatuses(): void {


        let scene = this.owner.getScene();


        // A status checking if there are any enemies at the guard
        
        let enemyBattlerFinder = new BasicFinder<Battler>(() => scene.getBattlers()[0], EnemyFilter(this.owner), RangeFilter(this.owner, 0, this.range*this.range));
        let enemyAtGuardPosition = new TargetExists([scene.getBattlers()[0]], enemyBattlerFinder);
        this.addStatus(DogStatuses.ENEMY_IN_DOG_POSITION, enemyAtGuardPosition);

        let allyBattlerFinder =new BasicFinder<Battler>(null, BattlerActiveFilter(), BattlerGroupFilter([this.owner.battleGroup]));
        let allyNearPlayer = new TargetExists(scene.getBattlers(), allyBattlerFinder);
        this.addStatus(DogStatuses.ALLY_NEAR, allyNearPlayer);
        if(allyNearPlayer) {
            console.log("cek");
        }
        // let enemyinrangefinder = new BasicFinder<Battler>(() => scene.getBattlers()[0], EnemyFilter(this.owner), RangeFilter(this.owner, 0, 30000));
        // let isClose = new TargetExists(scene.getBattlers(), enemyinrangefinder);
        // this.addStatus(GuardStatuses.READY_TO_ATTACK, isClose);
        // Add a status to check if a lasergun exists in the scene and it's visible
        // Add a status to check if the guard has a lasergun
       
        // Add the goal status
        this.addStatus(DogStatuses.GOAL, new FalseStatus());
    }
   
    protected initializeActions(): void {

        let scene = this.owner.getScene();

        let move_to_player = new MoveToPlayer(this, this.owner);
        move_to_player.range = this.range;
        move_to_player.scene = this.owner.getScene();
        move_to_player.targets = [scene.getBattlers()[0]];
        move_to_player.targetFinder = new BasicFinder<Battler>(ClosestPositioned(this.owner), BattlerActiveFilter(), EnemyFilter(this.owner), RangeFilter(this.owner, 0, this.range*this.range));
        move_to_player.addPrecondition(DogStatuses.ENEMY_IN_DOG_POSITION);
        move_to_player.addEffect(DogStatuses.GOAL);
        move_to_player.cost = 1;
        this.addState(DogActions.MOVE_TO_PLAYER, move_to_player);
        // An action for guarding the guard's guard location

        // let attack = new SlimeAttack(this, this.owner);
        // attack.scene = this.owner.getScene();
        // attack.targets = [scene.getBattlers()[0]];
        // attack.targetFinder = new BasicFinder<Battler>(ClosestPositioned(this.owner), BattlerActiveFilter(), EnemyFilter(this.owner), RangeFilter(this.owner, 0, 30000));
        // attack.addPrecondition(GuardStatuses.ENEMY_IN_GUARD_POSITION);
        // attack.addPrecondition(GuardStatuses.READY_TO_ATTACK);
        // attack.addEffect(GuardStatuses.GOAL);
        // attack.cost = 1;
        // this.addState(GuardActions.ATTACK_PLAYER, attack);

        // let guard = new RandomMovement(this, this.owner);
        // guard.scene = this.owner.getScene();
        // guard.targets = [this.target];
        // guard.targetFinder = new BasicFinder();
        // guard.range = this.range;
        // // guard.addPrecondition(GuardStatuses.HAS_WEAPON);
        // guard.addEffect(DogStatuses.GOAL);
        // guard.cost = 1000;
        // this.addState(DogActions.GUARD, guard);

        let attack = new WolfAttack(this, this.owner);
        attack.scene = this.owner.getScene();
        attack.targets = [scene.getBattlers()[0]];
        attack.targetFinder = new BasicFinder<Battler>(ClosestPositioned(this.owner), BattlerActiveFilter(), EnemyFilter(this.owner), RangeFilter(this.owner, 0, 30000));
        attack.addPrecondition(DogStatuses.ENEMY_IN_DOG_POSITION);
        attack.addPrecondition(DogStatuses.ALLY_NEAR);
        attack.addEffect(DogStatuses.GOAL);
        attack.cost = 1;
        this.addState(DogActions.ATTACK_PLAYER, attack);

        let guard = new Idle(this, this.owner);
        guard.targets = [this.target];
        guard.targetFinder = new BasicFinder();
        guard.addEffect(DogStatuses.GOAL);
        guard.cost = 1000;
        this.addState(DogActions.GUARD, guard);
    }


    public override addState(stateName: DogAction, state: GoapAction): void {
        super.addState(stateName, state);
    }


    public override addStatus(statusName: DogStatus, status: GoapState): void {
        super.addStatus(statusName, status);
    }
}


export interface DogOptions {
    target: TargetableEntity
    range: number;
}


export type DogStatus = typeof DogStatuses[keyof typeof DogStatuses];
export const DogStatuses = {
    ALLY_NEAR: "ALLY_NEAR",

    READY_TO_ATTACK: "READY_TO_ATTACK",

    ENEMY_IN_DOG_POSITION: "enemy-at-dog-position",

    GOAL: "goal"


} as const;


export type DogAction = typeof DogActions[keyof typeof DogActions];
export const DogActions = {
    FIND_ALLY: "find-player",

    MOVE_TO_PLAYER: "move-to-player",

    ATTACK_PLAYER: "attack-player",

    GUARD: "guard",

} as const;
