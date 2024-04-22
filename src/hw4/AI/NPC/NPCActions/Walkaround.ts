import NPCAction from "./NPCAction";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import GuardBehavior from "../NPCBehavior/GaurdBehavior";
import BasicTargetable from "../../../GameSystems/Targeting/BasicTargetable";
import Position from "../../../GameSystems/Targeting/Position";
import HW4Scene from "../../../Scenes/HW4Scene";


export default class RandomMovement extends NPCAction {
    protected radius: number;
    protected targetPosition: Vec2;
    protected timer: Timer;
    public scene: HW4Scene;
    public range: number;
    public constructor(parent: NPCBehavior, actor: NPCActor, radius: number = 100) {
        super(parent, actor);
        this.radius = radius;
        this.targetPosition = actor.position.clone();
        this.timer = new Timer(10000);
    }


    public performAction(): void {
        // if (this.timer.isStopped()) {
        //     const randomAngle = Math.random() * Math.PI * 2;
        //     const randomDirection = new Vec2(Math.cos(randomAngle), Math.sin(randomAngle));
        //     const randomDistance = Math.random() * this.radius;
        //     console.log("ddsadsa", this.actor.spawnpoint.clone().add(randomDirection.scaled(randomDistance)));
        //     this.targetPosition = this.actor.spawnpoint.clone().add(randomDirection.scaled(randomDistance));
        //     this.target = new BasicTargetable(new Position(this.targetPosition.x, this.targetPosition.y));
           


        //     // this.actor.addAI(GuardBehavior, {target: new BasicTargetable(new Position(this.targetPosition.x, this.targetPosition.y)), range: 500});
        //     // this.actor.setTarget(new BasicTargetable(new Position(this.targetPosition.x, this.targetPosition.y)));
        //     // Start the timer
        //     this.timer.start();
        // }
        // // If the NPC has reached the target position or if the timer has expired, finish the behavior
        //     this.finished();
        // Move the NPC towards the target position
        // You should implement the movement logic here
   
        // If the timer has expired, finish the behavior


    }
    public onEnter(options: Record<string, any>): void {
        // Select the target location where the NPC should perform the action
        const randomAngle = Math.random() * Math.PI * 2;
        const randomDirection = new Vec2(Math.cos(randomAngle), Math.sin(randomAngle));
        const randomDistance = Math.random() * this.radius;
        // console.log("ddsadsa", this.actor.spawnpoint.clone().add(randomDirection.scaled(randomDistance)));
        this.targetPosition = this.actor.spawnpoint.clone().add(randomDirection.scaled(randomDistance));
        this.target = new BasicTargetable(new Position(this.targetPosition.x, this.targetPosition.y));
        // If we found a target, set the NPCs target to the target and find a path to the target
       
        if (this.target !== null) {
            // Set the actors current target to be the target for this action
            this.actor.setTarget(this.target);
            // Construct a path from the actor to the target
            this.path = this.actor.getPath(this.actor.position, this.target.position);
        }
    }
    public update(deltaT: number): void {
        if (this.target !== null && this.path !== null && !this.path.isDone()) {
            if (this.actor.atTarget() || (Math.pow(this.actor.position.x - this.scene.getBattlers()[0].position.x, 2) + Math.pow(this.actor.position.y - this.scene.getBattlers()[0].position.y, 2)) <= this.range*this.range) {
                this.finished();
            } else {
                this.actor.moveOnPath(this.actor.speed * deltaT * 5, this.path);
            }
        } else {
            this.finished();
        }
    }
}
