import { GoapActionStatus } from "../../../../Wolfie2D/DataTypes/Goap/GoapAction";
import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import OrthogonalTilemap from "../../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import NPCAction from "./NPCAction";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import { BattlerEvent, PlayerEvent } from "../../../Events";
import HW4Scene from "../../../Scenes/HW4Scene";
import { EaseFunctionType } from "../../../../Wolfie2D/Utils/EaseFunctions";
import { TweenableProperties } from "../../../../Wolfie2D/Nodes/GameNode";
export default class AttackPlayer extends NPCAction {
    public scene: HW4Scene;
    public range: number;
    protected timer: Timer;
    protected timer2: Timer;
    protected oldx: number;
    protected oldy: number;
    public constructor(parent: NPCBehavior, actor: NPCActor) {
        super(parent, actor);
        this._target = null;
        this.timer = new Timer(6000);
        this.timer2 = new Timer(2000);
    }

    public performAction(target: TargetableEntity): void {
        // this.timer.isStopped() ? console.log("attacking!") : console.log("done!");
        // If the lasergun is not null and the lasergun is still in the actors inventory; shoot the lasergun
        // if (this.timer.isStopped()) {
        //     this.actor.tweens.add("attack", {
        //         startDelay: 0,
        //         duration: 1500,
        //         effects: [
        //             {
        //                 property: TweenableProperties.posX,
        //                 start: this.actor.position.x,
        //                 end: this.actor.position.x + 1.1*(this.target.position.x - this.actor.position.x),
        //                 ease: EaseFunctionType.OUT_SINE
        //             },
        //             {
        //                 property: TweenableProperties.posY,
        //                 start: this.actor.position.y,
        //                 end: this.actor.position.y + 1.1*(this.target.position.y - this.actor.position.y),
        //                 ease: EaseFunctionType.OUT_SINE
        //             }
        //         ]
        //     });
        //     this.actor.tweens.play("attack");
        //     (this.target.position.x - this.actor.position.x) < 0? this.actor.animation.play("Attack_Right") : this.actor.animation.play("Attack_Left");
        //     // Send a laser fired event
        //     // this.emitter.fireEvent(BattlerEvent.ATTACK, {
        //     //     actorId: this.actor.id,
        //     // });
        //     this.timer.start();
        //     // this.timer2.start();
        // }
        // // if(this.timer2.isStopped && !this.actor.animation.isPlaying("IDLE")) {
        // //     this.actor.animation.play("IDLE");
        // // }
        // // Finish the action
        // this.finished();
    }


    public onEnter(options: Record<string, any>): void {
        super.onEnter(options);
        this.actor.speed = 15;
        this.oldx = this.target.position.x;
        this.oldy = this.target.position.y;
        // Find a lasergun in the actors inventory
    }


    public handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleInput(event);
                break;
            }
        }
    }


    // public update(deltaT: number): void {
    //     super.update(deltaT);
    // }
    public update(deltaT: number): void {
        
        if (this.target !== null && this.path !== null && !this.path.isDone()) {
            if ((Math.pow(this.target.position.x - this.actor.position.x, 2) + Math.pow(this.target.position.y - this.actor.position.y, 2)) < 40004) {
                // this.performAction(this.target);
                // if(this.actor.animation.isPlaying("Attack_Left") || this.actor.animation.isPlaying("Attack_Right")) {
                //     if(this.checkOverlap() && this.timer2.isStopped()) {
                //         this.scene.getBattlers()[0].health -= 1;
                //         this.timer2.start();
                //     }
                // }
                this.finished();
            } else {
                // console.log(this.target.position.x , "das", this.oldx);
                if(Math.pow(this.target.position.x - this.oldx, 2) + Math.pow(this.target.position.y - this.oldy, 2)> 10000) {
                    // this.target = this.scene.getBattlers()[0];
                    this.actor.setTarget(this.target);
                    this.path = this.actor.getPath(this.actor.position, this.target.position);
                    this.oldx = this.target.position.x;
                    this.oldy = this.target.position.y;
                }
                // this.path = this.actor.getPath(this.actor.position, this.target.position);
                if(Math.pow(this.target.position.x - this.actor.position.x, 2) + Math.pow(this.target.position.y - this.actor.position.y, 2) > 40000) {
                    this.actor.moveOnPath(this.actor.speed * deltaT * 5, this.path);
                }
            }
        } else {
            this.finished();
        }
    }
    public onExit(): Record<string, any> {
        this.actor.speed = 10;
        // this.actor.animation.play("IDLE");
        // Clear the reference to the lasergun
        return super.onExit();
    }

    protected checkOverlap() {
		let distx = this.actor.position.x - this.target.position.x;
        let disty = this.actor.position.y - this.target.position.y;
        if(Math.abs(distx) > this.actor.collisionShape.hw + 32) {
            return false;
        }
        if(Math.abs(disty) > this.actor.collisionShape.hh + 64) {
            return false;
        }
        // console.log("hit");
        return true;
    }

    protected attackhit(walls: OrthogonalTilemap, start: Vec2, dir: Vec2): Vec2 {
        let end = start.clone().add(dir.scaled(900));
        let delta = end.clone().sub(start);


        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, end.x);
        let maxX = Math.max(start.x, end.x);
        let minY = Math.min(start.y, end.y);
        let maxY = Math.max(start.y, end.y);


        let minIndex = walls.getTilemapPosition(minX, minY);
        let maxIndex = walls.getTilemapPosition(maxX, maxY);


        let tileSize = walls.getScaledTileSize();


        for(let col = minIndex.x; col <= maxIndex.x; col++){
            for(let row = minIndex.y; row <= maxIndex.y; row++){
                if(walls.isTileCollidable(col, row)){
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x/2, row * tileSize.y + tileSize.y/2);


                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1/2));


                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);


                    if(hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(end)){
                        end = hit.pos;
                    }
                }
            }
        }
        return end;
    }


}
