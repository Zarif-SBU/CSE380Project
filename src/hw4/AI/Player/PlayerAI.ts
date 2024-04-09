import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import PlayerActor from "../../Actors/PlayerActor";
import { ItemEvent, PlayerEvent } from "../../Events";
import Inventory from "../../GameSystems/ItemSystem/Inventory";
import Item from "../../GameSystems/ItemSystem/Item";
import PlayerController from "./PlayerController";
import { Idle, Invincible, Moving, Dead, PlayerStateType } from "./PlayerStates/PlayerState";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Circle from "../../../Wolfie2D/DataTypes/Shapes/Circle";
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

    /** The GameNode that owns this AI */
    public owner: PlayerActor;
    /** A set of controls for the player */
    public controller: PlayerController;
    /** The inventory object associated with the player */
    public inventory: Inventory;
    /** The players held item */
    public item: Item | null;
    
    public initializeAI(owner: PlayerActor, opts: Record<string, any>): void {
        this.owner = owner;
        this.controller = new PlayerController(owner);

        // Add the players states to it's StateMachine
        this.addState(PlayerStateType.IDLE, new Idle(this, this.owner));
        this.addState(PlayerStateType.INVINCIBLE, new Invincible(this, this.owner));
        this.addState(PlayerStateType.MOVING, new Moving(this, this.owner));
        this.addState(PlayerStateType.DEAD, new Dead(this, this.owner));
        
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
                break;
            }
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
                console.log(this.owner.collisionShape.getBoundingRect())
                this.owner.health -= 1;
            }
        }
    }

    protected handleLightAttackEvent(start:Vec2, dir: Vec2): void {
        console.log(start);
        console.log(dir.x);
        console.log(this.owner.getScene().getBattlers());
        let box1:AABB = new AABB(new Vec2(start.x+(dir.x*30), start.y+(dir.y*30)), new Vec2(30, 30))
        
        
        
        for(let enemy of this.owner.getScene().getBattlers().slice(1)){
            let box2:AABB = new AABB(enemy.position, new Vec2(1, 1));
            if(this.intersectAABB(box1, box2)){
                console.log("stabbed");
                enemy.health = enemy.health - 1;
                //enemy.freeze()
                
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