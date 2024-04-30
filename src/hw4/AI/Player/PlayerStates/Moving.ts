import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import PlayerAI from "../PlayerAI";
import { PlayerStateType } from "./PlayerState";
import PlayerState from "./PlayerState";

export default class Moving extends PlayerState {
    
    public override onEnter(options: Record<string, any>): void {
        
    }

    public override handleInput(event: GameEvent): void { 
        switch(event.type) {
            default: {
                super.handleInput(event);
                
            }
        }
    }

    public override update(deltaT: number): void {
        super.update(deltaT);
        if((!this.owner.animation.isPlaying("WALK_RIGHT") || !this.owner.animation.isPlaying("WALK_FORWARD")) && !this.inAction()){
            if(this.parent.controller.moveDir.x === 0) {
                this.owner.animation.playIfNotAlready("WALK_FORWARD");
            } else {
                this.owner.animation.playIfNotAlready("WALK_RIGHT");
            }
        }
        if (this.parent.controller.moveDir.equals(Vec2.ZERO) && !this.inAction()) {
            this.finished(PlayerStateType.IDLE);
        }
    }

    public override onExit(): Record<string, any> { return {}; }
}