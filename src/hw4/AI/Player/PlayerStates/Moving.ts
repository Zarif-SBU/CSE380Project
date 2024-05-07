import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import PlayerState, { PlayerStateType } from "./PlayerState";

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
        this.checkpotionCollision(this.owner.position, this.parent.controller.moveDir);
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

    protected checkpotionCollision(start: Vec2, dir: Vec2): void {
        // Get the array of potions from the scene
        const potions = this.owner.getScene().getPotions();
    
        // Iterate over the potions array
        for (let i = 0; i < potions.length; i++) {
            const potion = potions[i];
            const potionBox: AABB = new AABB(potion.position, new Vec2(30, 10));
            const playerBox: AABB = new AABB(new Vec2(start.x + (dir.x * 120), start.y + (dir.y * 120)), new Vec2(50,10));
            
            // Check for collision between player and potion
            if (this.intersectAABB(playerBox, potionBox)) {
                if (this.owner.health < 10) {
                    this.owner.health++;
                }
                console.log("Player collided with potion!");
                
                // Remove the collided potion from the array
                potion.visible= false;
                potions.splice(i, 1);
                
                // Decrement the loop counter to account for the removed potion
                i--;
            }
        }
    }
}