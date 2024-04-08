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
import { BattlerEvent } from "../../../Events";
export default class AttackPlayer extends NPCAction {

    protected timer: Timer;
    
    public constructor(parent: NPCBehavior, actor: NPCActor) {
        super(parent, actor);
        this._target = null;
        this.timer = new Timer(2000);
    }

    public performAction(target: TargetableEntity): void {
        this.timer.isStopped() ? console.log("attacking!") : console.log("done!");
        // If the lasergun is not null and the lasergun is still in the actors inventory; shoot the lasergun
        if (this.timer.isStopped()) {
            // Send a laser fired event
            this.emitter.fireEvent(BattlerEvent.ATTACK, {
                actorId: this.actor.id,
            });
            this.timer.start();
        }
        // Finish the action
        this.finished();
    }

    public onEnter(options: Record<string, any>): void {
        super.onEnter(options);
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

    public update(deltaT: number): void {
        super.update(deltaT);
    }

    public onExit(): Record<string, any> {
        // Clear the reference to the lasergun
        return super.onExit();
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