import NPCAction from "./NPCAction";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import GuardBehavior from "../NPCBehavior/GaurdBehavior";
import BasicTargetable from "../../../GameSystems/Targeting/BasicTargetable";
import Position from "../../../GameSystems/Targeting/Position";

export default class RandomMovement extends NPCAction {
    protected radius: number;
    protected targetPosition: Vec2;
    protected timer: Timer;

    public constructor(parent: NPCBehavior, actor: NPCActor, radius: number = 40) {
        super(parent, actor);
        this.radius = radius;
        this.targetPosition = actor.position.clone();
        this.timer = new Timer(10000); 
    }

    public performAction(): void {
        if (this.timer.isStopped()) {
            const randomAngle = Math.random() * Math.PI * 2;
            const randomDirection = new Vec2(Math.cos(randomAngle), Math.sin(randomAngle));
            const randomDistance = Math.random() * this.radius;
            console.log("ddsadsa", this.actor.spawnpoint.clone().add(randomDirection.scaled(randomDistance)));
            this.targetPosition = this.actor.spawnpoint.clone().add(randomDirection.scaled(randomDistance));
            this.actor.addAI(GuardBehavior, {target: new BasicTargetable(new Position(this.targetPosition.x, this.targetPosition.y)), range: 100});
            // this.actor.setTarget(new BasicTargetable(new Position(this.targetPosition.x, this.targetPosition.y)));
            // Start the timer
            this.timer.start();
        }
            // If the NPC has reached the target position or if the timer has expired, finish the behavior
            this.finished();
        // Move the NPC towards the target position
        // You should implement the movement logic here
    
        // If the timer has expired, finish the behavior

    }

    //     public update(deltaT: number): void {
    //     if (this.target !== null && this.path !== null && !this.path.isDone()) {
    //         if (this.actor.atTarget()) {
    //             this.performAction(this.target);
    //             this.finished();
    //         } else {
    //             this.actor.moveOnPath(this.actor.speed * deltaT * 5, this.path);
    //         }
    //     } else {
    //         this.finished();
    //     }
    // }
}