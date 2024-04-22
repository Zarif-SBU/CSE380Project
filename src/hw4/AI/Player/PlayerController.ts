import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../../Wolfie2D/Timing/Timer";

/**
 * Strings used in the key binding for the player
 */
export enum PlayerInput {
    MOVE_UP = "MOVE_UP",
    MOVE_DOWN = "MOVE_DOWN",
    MOVE_LEFT = "MOVE_LEFT",
    MOVE_RIGHT = "MOVE_RIGHT",
    ATTACKING = "ATTACKING",
    PICKUP_ITEM = "PICKUP_ITEM",
    DROP_ITEM = "DROP_ITEM",
    LIGHT_ATTACK = "LIGHT_ATTACK",
    HEAVY_ATTACK = "HEAVY_ATTACK",
    BLOCK = "BLOCK",
    DODGE = "DODGE",
    HIT = "HIT",
}

/**
 * The PlayerController class handles processing the input recieved from the user and exposes  
 * a set of methods to make dealing with the user input a bit simpler.
 */
export default class PlayerController {

    /** The GameNode that owns the AI */
    protected owner: AnimatedSprite;
    timer: any;
    private currentFacingDirection: Vec2 = new Vec2(0, -1);
    

    constructor(owner: AnimatedSprite) {
        this.owner = owner;
        this.timer = new Timer(2000);
        
        
    }
    /**
     * Gets the direction the player should move based on input from the keyboard. 
     * @returns a Vec2 indicating the direction the player should move. 
     */
    public get moveDir(): Vec2 { 
        let dir: Vec2 = Vec2.ZERO;
        dir.y = (Input.isPressed(PlayerInput.MOVE_UP) ? -1 : 0) + (Input.isPressed(PlayerInput.MOVE_DOWN) ? 1 : 0);
		dir.x = (Input.isPressed(PlayerInput.MOVE_LEFT) ? -1 : 0) + (Input.isPressed(PlayerInput.MOVE_RIGHT) ? 1 : 0);

        
        return dir.normalize();
    }

    public get dodge(): boolean{
        if(this.timer.isStopped() && Input.isPressed(PlayerInput.DODGE) && !(this.moveDir.x === 0 && this.moveDir.y === 0)){
            let dir2: Vec2 = Vec2.ZERO;
            console.log("Dodge");
            this.timer.start()
            return true;
        }
        return false;
    }

    /** 
     * Gets the direction the player should be facing based on where the player is moving towards
     * @return a Vec2 representing the direction the player should face.
     */

public lastAnimationPlayed: string = "";

public get faceDir(): Vec2 {
    let animationToPlay = "";
    if (this.moveDir.x === 0 && this.moveDir.y === 0) {
        animationToPlay = "IDLE";
    } else if (this.moveDir.x > 0) {
        animationToPlay = "WALK_RIGHT";
    } else if (this.moveDir.x < 0) {
        animationToPlay = "WALK_LEFT";
    }else if (this.moveDir.y<0 &&  this.moveDir.x === 0){
        animationToPlay = "WALK_FORWARD"
    }else if (this.moveDir.y>0 &&  this.moveDir.x === 0){
        animationToPlay = "WALK_FORWARD"
    }
    
    if (animationToPlay !== "" && !this.owner.animation.isPlaying(animationToPlay)) {
        this.owner.animation.play(animationToPlay);
    }
    if(animationToPlay !== "IDLE") {
        this.lastAnimationPlayed = animationToPlay;
    }

    return new Vec2(0);
}
    /**
     * Gets the rotation of the players sprite based on the direction the player
     * should be facing.
     * @return a number representing how much the player should be rotated
     */
    public get rotation(): number { return Vec2.UP.angleToCCW(this.faceDir); }

    /** 
     * Checks if the player is attempting to use a held item or not.
     * @return true if the player is attempting to use a held item; false otherwise
     */
    public get useItem(): boolean { return Input.isMouseJustPressed(); }

    /** 
     * Checks if the player is attempting to pick up an item or not.
     * @return true if the player is attempting to pick up an item; false otherwise.
     */
    public get pickingUp(): boolean { return Input.isJustPressed(PlayerInput.PICKUP_ITEM); }

    /** 
     * Checks if the player is attempting to drop their held item or not.
     * @return true if the player is attempting to drop their held item; false otherwise.
     */
    public get dropping(): boolean { return Input.isJustPressed(PlayerInput.DROP_ITEM); }


    public get lightAttack(): boolean { return Input.isJustPressed(PlayerInput.LIGHT_ATTACK); }
    public get heavyAttack(): boolean { return Input.isJustPressed(PlayerInput.HEAVY_ATTACK); }
    public get block(): boolean { return Input.isJustPressed(PlayerInput.BLOCK); }

}