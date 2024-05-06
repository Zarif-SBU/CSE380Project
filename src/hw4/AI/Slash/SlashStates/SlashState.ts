import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import SlashController from "../SlashController";
import StateMachine from "../../../../Wolfie2D/DataTypes/State/StateMachine";
import SlashAI from "../Slash";
import SlashActor from "../../../Actors/SlashActor";
import { PlayerEvent } from "../../../Events";
export default abstract class SlashState extends State {
    
    protected parent: SlashAI;
    protected owner: SlashActor;

    stateName: string;

    public constructor(parent: SlashAI, owner: SlashActor) {
        super(parent);
        this.owner = owner;
    }
    public override onEnter(options: Record<string, any>): void {}
    public override onExit(): Record<string, any> { return {}; }

    public override update(deltaT: number): void {
        this.emitter.fireEvent(PlayerEvent.PLAYER_ATTACKING, {
            actorId: this.parent.owner.id,
            center: this.parent.owner.position,
            hh: this.parent.owner.collisionShape.getBoundingRect(),
            hw: this.parent.owner.collisionShape.hw
        });
        if(!this.parent.owner.animation.isPlaying(SlashAnimationType.RIGHT_SLASH) && !this.parent.owner.animation.isPlaying(SlashAnimationType.UP_SLASH) && !this.parent.owner.animation.isPlaying(SlashAnimationType.DOWN_SLASH) && !this.parent.owner.animation.isPlaying(SlashAnimationType.LEFT_SLASH)) {
            this.parent.owner.getScene().getBattlers().pop();
            this.parent.owner.destroy();
        }
    }
}

export enum SlashStateType {
    ATTACKING = "ATTACKING",
}

export enum SlashAnimationType {
    RIGHT_SLASH = "RIGHT_SLASH",
    UP_SLASH = "UP_SLASH",
    LEFT_SLASH = "LEFT_SLASH",
    DOWN_SLASH = "DOWN_SLASH"
}