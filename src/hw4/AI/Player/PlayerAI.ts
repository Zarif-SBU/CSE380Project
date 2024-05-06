import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Timer from "../../../Wolfie2D/Timing/Timer";
import PlayerActor from "../../Actors/PlayerActor";
import { PlayerEvent } from "../../Events";
import PlayerController from "./PlayerController";
import Dodge from "./PlayerStates/Dodge";
import { Dead, Idle, Invincible, Moving, PlayerStateType } from "./PlayerStates/PlayerState";
/**
 * The AI that controls the player. The players AI has been configured as a Finite State Machine (FSM)
 * with 4 states; Idle, Moving, Invincible, and Dead.
 */
type Collider = AABB;
 class Point{
    public x: number;
    public y: number;
  
    constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
    }
}
export function abs(value: number): number {
    return value < 0 ? -value : value;
  }
export function sign(value: number): number {
    return value < 0 ? -1 : 1;
}

 class Hit {
    
    public collider: Collider;
    public pos: Point;
    public delta: Point;
    public normal: Point;
    public time: number;
  
    constructor(collider: Collider) {
      this.collider = collider;
      this.pos = new Point();
      this.delta = new Point();
      this.normal = new Point();
      this.time = 0;
    }
  }
export default class PlayerAI extends StateMachineAI implements AI {
    public timer: Timer;
    /** The GameNode that owns this AI */
    public owner: PlayerActor;
    /** A set of controls for the player */
    public controller: PlayerController;
    /** The inventory object associated with the player */
    /** The players held item */
    

    public initializeAI(owner: PlayerActor, opts: Record<string, any>): void {
        this.timer = new Timer(2000);
        this.owner = owner;
        this.controller = new PlayerController(owner);

        // Add the players states to it's StateMachine
        this.addState(PlayerStateType.IDLE, new Idle(this, this.owner));
        this.addState(PlayerStateType.INVINCIBLE, new Invincible(this, this.owner));
        this.addState(PlayerStateType.MOVING, new Moving(this, this.owner));
        this.addState(PlayerStateType.DEAD, new Dead(this, this.owner));
        this.addState(PlayerStateType.DODGE, new Dodge(this, this.owner));
        
        // Initialize the players state to Idle
        this.initialize(PlayerStateType.IDLE);
    }

    public activate(options: Record<string, any>): void { }

    public update(deltaT: number): void {
        super.update(deltaT);
        
    }

    public destroy(): void {}

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case PlayerEvent.LIGHT_ATTACK: {
                this.handleLightAttackEvent(event.data.get("start"), event.data.get("dir"));
                console.log("light attacked")
                // this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "light", loop: false, holdReference: false})
                
                break;
            }
            case PlayerEvent.HEAVY_ATTACK: {
                this.handleHeavyAttackEvent(event.data.get("start"), event.data.get("dir"));
                console.log("heavy attacked")
                // this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "heavy", loop: false, holdReference: false})
                break;
            }
            case PlayerEvent.BLOCK: {
                this.handleBlockEvent(event.data.get("start"), event.data.get("dir"));
                break;
            }
            case PlayerEvent.HIT: {
                if(this.timer.isStopped()) {
                    this.owner.health -= 1;
                    this.timer.start();
                    
                }
                // console.log("breh");
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
                console.log(this.owner.collisionShape.getBoundingRect())
                this.owner.health -= 1;
            }
        }
    }
    protected handleHeavyAttackEvent(start:Vec2, dir: Vec2): void {
        console.log(start);
        console.log(dir);
        console.log(this.owner.getScene().getBattlers());
        let box1:AABB = new AABB(new Vec2(start.x+(dir.x*120), start.y+(dir.y*120)), new Vec2(120, 120))
        for(let enemy of this.owner.getScene().getBattlers().slice(1)){
            let box2:AABB = new AABB(enemy.position, new Vec2(1, 1));
            if(this.intersectAABB(box1, box2)){
                if(enemy.health <= 0){
                    continue;
                }
                //console.log("stabbed");
                // enemy.animation.play("IDLE");
                enemy.health = enemy.health - 2;
                
                //enemy.freeze()
                //console.log(enemy);
                if(enemy.health <= 0){
                    //console.log("enemy down");
                    enemy.health = 0;
                    enemy.battlerActive = false;
                    //this.owner.getScene().getBattlers().splice(this.owner.getScene().getBattlers().indexOf(enemy));
                }
                
            }
        }
    }
    protected handleBlockEvent(start:Vec2, dir: Vec2): void {

    }

    protected handleLightAttackEvent(start:Vec2, dir: Vec2): void {
        console.log(start);
        console.log(dir);
        console.log(this.owner.getScene().getBattlers());
        let box1:AABB = new AABB(new Vec2(start.x+(dir.x*120), start.y+(dir.y*120)), new Vec2(60, 60))
        
        
        
        for(let enemy of this.owner.getScene().getBattlers().slice(1)){
            let box2:AABB = new AABB(enemy.position, new Vec2(1, 1));
            if(this.intersectAABB(box1, box2)){
                if(enemy.health <= 0){
                    continue;
                }
                //console.log("stabbed");
                // enemy.animation.play("IDLE");
                enemy.health = enemy.health - 1;
                
                //enemy.freeze()
                //console.log(enemy);
                if(enemy.health <= 0){
                    //console.log("enemy down");
                    enemy.battlerActive = false;
                    //this.owner.getScene().getBattlers().splice(this.owner.getScene().getBattlers().indexOf(enemy));
                }
                
            }
        }

        /*
        if (this.owner.id !== actorId && this.owner.collisionShape !== undefined ) {
            if (this.owner.collisionShape.getBoundingRect().intersectSegment(to, from.clone().sub(to)) !== null) {
                this.owner.health -= 1;
            }
        }*/
    }
    
    public intersectAABB(box: AABB, box2:AABB): Hit | null {
        const dx = box.center.x - box2.center.x;
        const px = (box.halfSize.x + box2.halfSize.x) - abs(dx);
        if (px <= 0) {
          return null;
        }
    
        const dy = box.center.y - box2.center.y;
        const py = (box.halfSize.y + box2.halfSize.y) - abs(dy);
        if (py <= 0) {
          return null;
        }
    
        const hit = new Hit(box2);
        if (px < py) {
          const sx = sign(dx);
          hit.delta.x = px * sx;
          hit.normal.x = sx;
          hit.pos.x = box2.center.x + (box2.halfSize.x * sx);
          hit.pos.y = box.center.y;
        } else {
          const sy = sign(dy);
          hit.delta.y = py * sy;
          hit.normal.y = sy;
          hit.pos.x = box.center.x;
          hit.pos.y = box2.center.y + (box2.halfSize.y * sy);
        }
        return hit;
      }
}