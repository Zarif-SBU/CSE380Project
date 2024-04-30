import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Input from "../../../../Wolfie2D/Input/Input";
import PlayerAI from "../PlayerAI";
import { PlayerStateType } from "./PlayerState";
import PlayerState from "./PlayerState";

export default class Dodge extends PlayerState {
    
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
        if(!this.owner.animation.isPlaying("BOOST_RIGHT") && !this.inAction()){
            if(this.parent.controller.moveDir.x === 0) {
                this.owner.animation.playIfNotAlready("BOOST_RIGHT", false);
            }
        } else if (this.owner.animation.isPlaying("BOOST_RIGHT")) {
            // this.parent.owner.move(this.parent.controller.moveDir.scale(200));
        }
        if (this.parent.controller.moveDir.equals(Vec2.ZERO) && !this.inAction()) {
            this.finished(PlayerStateType.IDLE);
        }
        if (!this.parent.controller.moveDir.equals(Vec2.ZERO) && !this.inAction()) {
            this.finished(PlayerStateType.MOVING);
        }
    }

    public override onExit(): Record<string, any> { return {}; }
}