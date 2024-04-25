import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { BattlerEvent, HudEvent, PlayerEvent } from "../../../Events"
import PlayerAI from "../PlayerAI";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import Line from "../../../../Wolfie2D/Nodes/Graphics/Line";
import GameNode, { TweenableProperties } from "../../../../Wolfie2D/Nodes/GameNode";
import { EaseFunctionType } from "../../../../Wolfie2D/Utils/EaseFunctions";
import ParticleSystem from "../../../../Wolfie2D/Rendering/Animations/ParticleSystem";
export enum PlayerAnimationType {
    IDLE = "IDLE"
}


export enum PlayerStateType {
    IDLE = "IDLE",
    INVINCIBLE = "INVINCIBLE",
    ATTACKING = "ATTACKING",
    MOVING = "MOVING",
    DEAD = "DEAD"
}

export default abstract class PlayerState extends State {
    
    protected parent: PlayerAI;
    protected owner: PlayerActor;
    lightTimer: any;
    heavyTimer: any;
    protected _smoke: Line
    protected system: ParticleSystem
    public constructor(parent: PlayerAI, owner: PlayerActor) {
        super(parent);
        this.owner = owner;
        this.lightTimer = new Timer(500)
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
        this.parent.owner.move(this.parent.controller.moveDir.scale(3));

        // Handle the player trying to pick up an item

        // Handle the player trying to drop an item

        if (this.parent.controller.dodge) {
            let vec = this.parent.controller.moveDir;
            
            this.parent.owner.move(new Vec2(vec.x*100, vec.y*100));
            // this.owner.tweens.play("dodge");
            // this.system.initializePool(this.owner.getScene(), "primary");
            // this.system.startSystem(1000, 0.1, this.owner.position.clone());
            console.log("Shitty animation played")
            
        }
        if (this.parent.controller.lightAttack) {
            //console.log(this.owner.position);
            if(this.lightTimer.isStopped()){
                //console.log("Light Attack");
                this.lightTimer.start()
                this.emitter.fireEvent(PlayerEvent.LIGHT_ATTACK, {start:this.owner.position.clone(), dir:this.parent.controller.moveDir.clone()});
            }
            else{
                console.log("Light Attack on cooldown");
            }
            
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
                throw new Error(`Unhandled event of type ${event.type} caught in PlayerState!`);
            }
        }
    }

}

import Idle from "./Idle";
import Invincible from "./Invincible";
import Moving from "./Moving";
import Dead from "./Dead";
import PlayerActor from "../../../Actors/PlayerActor";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
export { Idle, Invincible, Moving, Dead} 