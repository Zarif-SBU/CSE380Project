import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import CharacterState, { CharacterStateType } from "./CharacterState";

export default class Moving extends CharacterState {
    
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
        if (this.parent.controller.moveDir.equals(Vec2.ZERO)) {
            this.finished(CharacterStateType.IDLE);
        }
    }

    public override onExit(): Record<string, any> { return {}; }
}