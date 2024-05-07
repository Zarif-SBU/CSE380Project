import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { BattlerEvent, HudEvent, PlayerEvent } from "../../../Events"
import PlayerAI from "../PlayerAI";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import Line from "../../../../Wolfie2D/Nodes/Graphics/Line";
import GameNode, { TweenableProperties } from "../../../../Wolfie2D/Nodes/GameNode";
import { EaseFunctionType } from "../../../../Wolfie2D/Utils/EaseFunctions";
import ParticleSystem from "../../../../Wolfie2D/Rendering/Animations/ParticleSystem";
 

let facing = true;

export enum PlayerAnimationType {
    IDLE = "IDLE"
}

export enum PlayerStateType {
    IDLE = "IDLE",
    INVINCIBLE = "INVINCIBLE",
    ATTACKING = "ATTACKING",
    MOVING = "MOVING",
    DEAD = "DEAD",
    DODGE = "DODGE"
}

export default abstract class PlayerState extends State {
    
    protected parent: PlayerAI;
    protected owner: PlayerActor;
    lightTimer: any;
    heavyTimer: any;
    protected _smoke: Line
    protected system: ParticleSystem
    protected invincible;
    public constructor(parent: PlayerAI, owner: PlayerActor) {
        super(parent);
        this.owner = owner;
        this.invincible = false;
        this.lightTimer = new Timer(1000)
        this.heavyTimer = new Timer(2000)
        this.system = new ParticleSystem(100, new Vec2((5 * 32), (10 * 32)), 2000, 3, 1, 100);
        this.owner.tweens.add("dodge", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 2 * Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });

    }

    public override onEnter(options: Record<string, any>): void {}
    public override onExit(): Record<string, any> { return {}; }

    public override update(deltaT: number): void {
        // Adjust the angle the player is facing 
        this.parent.owner.rotation = this.parent.controller.rotation;
        // Move the player
        this.parent.owner.move(this.parent.controller.moveDir.scale(5));

        // Handle the player trying to pick up an item

        // Handle the player trying to drop an item
        let direction = this.parent.controller.moveDir.x;
		if(direction !== 0) {
			(<Sprite>this.owner).invertX = MathUtils.sign(direction) < 0;
            facing = MathUtils.sign(direction) < 0;
		}
        if(Input.isJustPressed("DODGE") && !this.owner.animation.isPlaying("BOOST_RIGHT") && !this.inAction()){
            if(!this.parent.controller.moveDir.equals(Vec2.ZERO)) {
                this.owner.animation.playIfNotAlready("BOOST_RIGHT", false);
            }
            // else if(facing > 0) {

            // }
        } else if (this.owner.animation.isPlaying("BOOST_RIGHT")) {
            // if(this.parent.controller.moveDir.equals(Vec2.ZERO)) {
            //     if(facing > 0) {
            //         this.parent.owner.move(new Vec2(-14,0));
            //     } else {
            //         this.parent.owner.move(new Vec2(14,0));
            //     }
            // } else {
                this.parent.owner.move(this.parent.controller.moveDir.scale(16));
            // }
        }

        if (Input.isJustPressed("LIGHT_ATTACK") && !this.inAction()) {
            let attack;
            if(Input.isJustPressed('i')) {
                this.invincible = !this.invincible;
                console.log(this.invincible);
    
            }
            if(Input.isKeyPressed('w')) {
                let slash = this.owner.getScene().add.animatedSprite(SlashActor, "Slash", "primary");
                slash.position.set(this.owner.position.x, this.owner.position.y - 85);
                slash.battleGroup = 3;
                slash.health = 0;
                slash.maxHealth = 0;
                slash.speed = 0;
                slash.addPhysics(new AABB(Vec2.ZERO, new Vec2(65,65)), null, false);
                slash.addAI(SlashAI);
    
                slash.animation.play("UP_SLASH");
                this.owner.getScene().getBattlers().push(slash);
            }
            else if(Input.isKeyPressed('s')) {
                let slash = this.owner.getScene().add.animatedSprite(SlashActor, "Slash", "primary");
                slash.position.set(this.owner.position.x, this.owner.position.y + 85);
                slash.battleGroup = 3;
                slash.health = 0;
                slash.maxHealth = 0;
                slash.speed = 0;
                slash.addPhysics(new AABB(Vec2.ZERO, new Vec2(65,65)), null, false);
                slash.addAI(SlashAI);
                slash.animation.play("DOWN_SLASH");
                this.owner.getScene().getBattlers().push(slash);
            }
            else {
                if(!facing) {
                    let slash = this.owner.getScene().add.animatedSprite(SlashActor, "Slash", "primary");
                    slash.position.set(this.owner.position.x + 100, this.owner.position.y);
                    slash.battleGroup = 3;
                    slash.health = 0;
                    slash.maxHealth = 0;
                    slash.speed = 0;
                    slash.addPhysics(new AABB(Vec2.ZERO, new Vec2(65, 65)), null, false);
                    slash.addAI(SlashAI);
                    slash.animation.play("RIGHT_SLASH");
                    this.owner.getScene().getBattlers().push(slash);
                } else {
                    let slash = this.owner.getScene().add.animatedSprite(SlashActor, "Slash", "primary");
                    slash.position.set(this.owner.position.x - 100, this.owner.position.y);
                    slash.battleGroup = 3;
                    slash.health = 0;
                    slash.maxHealth = 0;
                    slash.speed = 0;
                    slash.addPhysics(new AABB(Vec2.ZERO, new Vec2(65,65)), null, false);
                    slash.addAI(SlashAI);
                    slash.animation.play("LEFT_SLASH");
                    this.owner.getScene().getBattlers().push(slash);
                }
            }
            this.emitter.fireEvent(PlayerEvent.LIGHT_ATTACK, {start:this.owner.position.clone(), dir:this.parent.controller.moveDir.clone()});
            this.owner.animation.playIfNotAlready("ATTACK_RIGHT", false);
            // this.handleLightAttackEvent(this.owner.position.clone(), this.parent.controller.moveDir.clone());
        }

        if (this.parent.controller.heavyAttack) {
            if(this.heavyTimer.isStopped()){
                console.log("Heavy Attack");
                this.heavyTimer.start()
                this.emitter.fireEvent(PlayerEvent.HEAVY_ATTACK, {start:this.owner.position.clone(), dir:this.parent.controller.moveDir.clone()});
            }
            else{
                console.log("Heavy Attack on cooldown");
            }

        }
        if (this.parent.controller.block) {

        }
    }

    public override handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                // throw new Error(`Unhandled event of type ${event.type} caught in PlayerState!`);
            }
        }
    }
	inAction () {
		const actions = [
            "BOOST_RIGHT",
			"ATTACK_RIGHT",
            "DAMAGE_LEFT"
		]
		return actions.some(attack => this.owner.animation.isPlaying(attack))
	}
        protected handleLightAttackEvent(start:Vec2, dir: Vec2): void {
        console.log(start);
        console.log(dir);
        console.log(this.owner.getScene().getBattlers());
        let box1:AABB = new AABB(new Vec2(start.x+(dir.x*120), start.y+(dir.y*120)), new Vec2(60, 60))
        // this.owner.getScene().add.animatedSprite("Slash", Layer.Main);
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
import Idle from "./Idle";
import Invincible from "./Invincible";
import Moving from "./Moving";
import Dead from "./Dead";
import Dodge from "./Dodge";
import PlayerActor from "../../../Actors/PlayerActor";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import { PlayerInput } from "../PlayerController";
import Input from "../../../../Wolfie2D/Input/Input";
import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Layer from "../../../../Wolfie2D/Scene/Layer";
import SlashActor from "../../../Actors/SlashActor";
import SlashAI from "../../Slash/Slash";
export { Idle, Invincible, Moving, Dead, Dodge} 