import PositionGraph from "../../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Actor from "../../../Wolfie2D/DataTypes/Interfaces/Actor";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Navmesh from "../../../Wolfie2D/Pathfinding/Navmesh";
import DirectStrategy from "../../../Wolfie2D/Pathfinding/Strategies/DirectStrategy";
import RenderingManager from "../../../Wolfie2D/Rendering/RenderingManager";
import Layer from "../../../Wolfie2D/Scene/Layer";
import SceneManager from "../../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../../Wolfie2D/Timing/Timer";
import GuardBehavior from "../../AI/NPC/NPCBehavior/GaurdBehavior";
import IdleBehavior from "../../AI/NPC/NPCBehavior/IdleBehavior";
import DragonBehavior from "../../AI/NPC/NPCBehavior/DragonBehavior";
import PlayerAI from "../../AI/Player/PlayerAI";
import NPCActor from "../../Actors/NPCActor";
import PlayerActor from "../../Actors/PlayerActor";
import { BattlerEvent, PlayerEvent } from "../../Events";
import Battler from "../../GameSystems/BattleSystem/Battler";
import BattlerBase from "../../GameSystems/BattleSystem/BattlerBase";
import HealthbarHUD from "../../GameSystems/HUD/HealthbarHUD";
import StaticHealthbarHUD from "../../GameSystems/HUD/StaticHealthbarHUD";
import BasicTargetable from "../../GameSystems/Targeting/BasicTargetable";
import Position from "../../GameSystems/Targeting/Position";
import AstarStrategy from "../../Pathfinding/AstarStrategy";
import HW4Scene from "../HW4Scene";
import Potion from "../../GameSystems/ItemSystem/Potion";

const BattlerGroups = {
    RED: 1,
    BLUE: 2
} as const;

export default class lvl6Scene extends HW4Scene {
    public getPotions(): Potion[] {
        //throw new Error("Method not implemented.");
        return []
    }
    public level: number;

    protected healthSprite:any;
    protected Health:Layer;
    /** GameSystems in the HW4 Scene */

    /** All the battlers in the HW4Scene (including the player) */
    private battlers: (Battler & Actor)[];
    /** Healthbars for the battlers */
    protected healthbars: Map<number, HealthbarHUD>;
    protected StaticHealthbars: Map<number, StaticHealthbarHUD>;

    protected door = false;
    private bases: BattlerBase[];

    protected player:PlayerActor;

    protected TotalEnemies: 0;
    protected enemies:Battler[] = [];

    //I am legit pulling out all of the stops on this one
    protected dragon:NPCActor
    protected phase:number
    protected addsleft:number
    protected count1:number
    protected count2:number
    protected count3:number
    protected count4:number
    // The wall layer of the tilemap
    private walls: OrthogonalTilemap;

    // The position graph for the navmesh
    private graph: PositionGraph;

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);
        this.battlers = new Array<Battler & Actor>();
        this.healthbars = new Map<number, HealthbarHUD>();
        this.StaticHealthbars= new Map<number, StaticHealthbarHUD>;
    }

    protected timer: Timer;

    /**
     * @see Scene.update()
     */
    public loadScene() {
        super.loadScene();
        // Load the player and enemy spritesheets
        // this.load.spritesheet("player1", "hw4_assets/spritesheets/player1.json");
        this.load.spritesheet("player1", "hw4_assets/spritesheets/MainCharacter/MainCharacter1.json");
        this.load.spritesheet("Slash", "hw4_assets/spritesheets/MainCharacter/Slash.json");
        // Load in the enemy sprites
       
        // this.load.spritesheet("Slime", "hw4_assets/spritesheets/RedEnemy.json");
        this.load.spritesheet("Slime", "hw4_assets/spritesheets/Enemies/BlackPudding/black_pudding.json");
        this.load.spritesheet("Moondog", "hw4_assets/spritesheets/Enemies/Moondog/moondog.json");
        //this.load.spritesheet("Slime", "hw4_assets/spritesheets/Enemies/BlackPudding/black_pudding.json");
        this.load.spritesheet("Dragon", "hw4_assets/spritesheets/Enemies/dragon/dragon.json");
        this.load.spritesheet("Firebreath", "hw4_assets/spritesheets/Enemies/dragon/fire1.json")
        this.load.audio("level_music6", "hw4_assets/Audio/lvl3.mp3");
        this.load.audio("select", "hw4_assets/Audio/select.mp3");
        
        // Load the tilemap
        this.load.image("sky","hw4_assets/SceneImages/skyBackground.png")
        this.load.tilemap("level", "hw4_assets/tilemaps/lvl6.json");

        // Load the enemy locations
        this.load.object("slimes", "hw4_assets/data/enemies/slime.json");
        this.load.object("moondogs", "hw4_assets/data/enemies/Moondog.json");
        //this.load.object("blue", "hw4_assets/data/enemies/blue.json");
        this.load.object("dragons", "hw4_assets/data/enemies/dragon.json");
    }
    /**
     * @see Scene.startScene
     */
    public override startScene() {
        this.currentLevel = lvl6Scene;
        this.nextLevel=lvl6Scene;
        this.lvlScene = this.addUILayer("lvlScene")
        this.LevelEnd = [new Vec2(2913, 832), new Vec2(3055, 832)];//range of where the door is
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "select", loop: false, holdReference: true});
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music6", loop: true, holdReference: true});
        

        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");
        this.tilemap = <OrthogonalTilemap>tilemapLayers[0].getItems()[0];
        
        // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];
        
        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;
        
        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
        this.viewport.setZoomLevel(1);

        this.Health = this.addUILayer("Health");
        this.healthSprite = this.add.sprite("health", "Health")
        this.healthSprite.position.set(220,70);
        
        this.initLayers();
        
        // Create the player
        this.initializePlayer();
        
        
        this.initializeNavmesh();
        
        // Create the NPCS
        this.initializeNPCs();
        
        // Subscribe to relevant events
        
        // Add a UI for health
        this.addUILayer("health");
        
        
        this.receiver.subscribe(PlayerEvent.PLAYER_KILLED);
        this.receiver.subscribe(BattlerEvent.BATTLER_KILLED);
        this.receiver.subscribe(BattlerEvent.BATTLER_RESPAWN);
        
        this.timer = new Timer(10000, ()=>{
            console.log("Timer ended")
        },false)
        
        let pauseCount = 0
        window.addEventListener('keydown', (event) => {
            if (event.key === "Escape" ) {
                pauseCount++;
                super.startScene();
                
            }
        });
        this.phase = 1
        this.addsleft = 0
        this.count1 = 0
        this.count2 = 0
        this.count3 = 0
        this.count4 = 0
        this.dragonStart();
        
    }
    async dragonStart(){
        await this.dragonBehavior()
    }
    async dragonBehavior(){ //ironic
        let slime = this.load.getObject("slimes");
        let moondog = this.load.getObject("moondogs");
        let firebreath = this.load.getSpritesheet("Firebreath");
        let projectiles: NPCActor[] = []
        while(true){
            await this.delay(600);
            //await console.log(this.dragon);
            if(this.phase == 1){
                
                if(this.dragon.health <= 75){
                    this.phase = 2;
                }
                else{
                    if(this.count2 < 1 || this.count4 == 2){
                        let npc = this.add.animatedSprite(NPCActor, "Firebreath", "primary");
                        npc.position.set(1250+this.count2*50, 1790);
                        npc.scale.set(2,1.5)
                        //npc.rotation = 120
                        npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(200, 360)), null, false);
                        console.log(npc)
                        npc.animation.play("START");
                        projectiles.push(npc)
                        this.count2+=1
                        this.count3=0
                        this.count4=0
                    }
                    
                    
                }
                console.log(projectiles)
                for(const projectile of projectiles){
                    console.log(projectile.animation.isPlaying("START"))
                    if(!projectile.animation.isPlaying("START")){
                        projectile.animation.playIfNotAlready("CONTINUOUS");
                    }
                    this.count3 +=1
                    let aabb 
                    console.log(projectile.collisionShape.getBoundingRect())
                    console.log(this.player.collisionShape.getBoundingRect())
                    if(this.intersectAABB(projectile.collisionShape.getBoundingRect(), this.player.collisionShape.getBoundingRect())){
                        console.log("in fire breath")
                        this.player.health -= 1
                    }
                    
                    if(this.count3 >= 10){
                        projectile.destroy();
                        projectiles.splice(projectiles.indexOf(projectile), 1)
                        this.count4 = 1
                    }
                    
                    console.log(this.count3)
                }
                if(this.count4 == 1){
                    this.count3 -= 2
                    if(this.count3 <= 0){
                        this.count4 = 2
                        this.count2 = 0
                    }
                }
                
            }
            else if(this.phase == 2){
                if(this.dragon.health <= 50){
                    this.phase = 3;
                    this.count1 = 0;
                    this.count2 = 0;
                    //this.count3 = 0;
                    //this.count4 = 0;
                }
                
                if(this.count1 == 0){
                    this.dragon.animation.play("SUMMON");
                    await this.delay(2000);
                    for (let i = 0; i < 4; i++) {
                        let npc = this.add.animatedSprite(NPCActor, "Slime", "primary");
                        npc.position.set(1050+i*50, 1150+i*50);
                        npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(50, 30)), null, false);
                        this.TotalEnemies += 1;
                
                        // Give the NPC a healthbar
                        let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(1, 1/10), offset: npc.size.clone().scaled(0, -1/3)});
                        this.healthbars.set(npc.id, healthbar);
                        
                        // Set the NPCs stats
                        npc.battleGroup = 1;
                        npc.speed = 5;
                        npc.health = 5;
                        npc.maxHealth = 5;
                        npc.navkey = "navmesh";
                        npc.spawnpoint = npc.position.clone();
                        npc.addAI(GuardBehavior, {target: new BasicTargetable(new Position(npc.position.x, npc.position.y)), range: 300});
                        
                        // Play the NPCs "IDLE" animation
                        npc.animation.play("IDLE");
                        // Add the NPC to the battlers array
                        this.battlers.push(npc);
                        this.enemies.push(npc);
                    }
                    
                    for (let i = 0; i < 4; i++) {
                        let npc = this.add.animatedSprite(NPCActor, "Moondog", "primary");
                        npc.position.set(1050+i*50, 1350+i*50);
                        npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(50, 30)), null, false);
                        this.TotalEnemies += 1;
                
                        // Give the NPC a healthbar
                        let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(1, 1/10), offset: npc.size.clone().scaled(0, -1/3)});
                        this.healthbars.set(npc.id, healthbar);
                        
                        // Set the NPCs stats
                        npc.battleGroup = 1;
                        npc.speed = 5;
                        npc.health = 5;
                        npc.maxHealth = 5;
                        npc.navkey = "navmesh";
                        npc.spawnpoint = npc.position.clone();
                        npc.addAI(GuardBehavior, {target: new BasicTargetable(new Position(npc.position.x, npc.position.y)), range: 300});
                        
                        // Play the NPCs "IDLE" animation
                        npc.animation.play("IDLE");
                        // Add the NPC to the battlers array
                        this.battlers.push(npc);
                        this.enemies.push(npc);
                    }
                    this.count1 = 1;
                }
                else{
                    if(this.count2 < 1 || this.count4 == 2){
                        let npc = this.add.animatedSprite(NPCActor, "Firebreath", "primary");
                        npc.position.set(1250+this.count2*50, 1670);
                        //npc.rotation = 120
                        npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(100, 240)), null, false);
                        console.log(npc)
                        npc.animation.play("START");
                        projectiles.push(npc)
                        this.count2+=1
                        this.count3=0
                        this.count4=0
                    }
                    
                    
                }
                console.log(projectiles)
                for(const projectile of projectiles){
                    console.log(projectile.animation.isPlaying("START"))
                    if(!projectile.animation.isPlaying("START") && !projectile.animation.isPlaying("SUMMON") ){
                        projectile.animation.playIfNotAlready("CONTINUOUS");
                    }
                    this.count3 +=1
                    let aabb 
                    console.log(projectile.collisionShape.getBoundingRect())
                    console.log(this.player.collisionShape.getBoundingRect())
                    if(this.intersectAABB(projectile.collisionShape.getBoundingRect(), this.player.collisionShape.getBoundingRect())){
                        console.log("in fire breath")
                        this.player.health -= 1
                    }
                    
                    if(this.count3 >= 10){
                        projectile.destroy();
                        projectiles.splice(projectiles.indexOf(projectile), 1)
                        this.count4 = 1
                    }
                    
                    console.log(this.count3)
                }
                if(this.count4 == 1){
                    this.count3 -= 2
                    if(this.count3 <= 0){
                        this.count4 = 2
                        this.count2 = 0
                    }
                }
            }
            else if(this.phase == 3){
                if(this.dragon.health <= 25){
                    this.phase = 4;
                    this.count1 = 0;
                    this.count2 = 0;
                    //this.count3 = 0;
                    //this.count4 = 0;
                }
                if(this.count1 == 0){
                    this.dragon.animation.play("SUMMON");
                    await this.delay(2000);
                    for (let i = 0; i < 4; i++) {
                        let npc = this.add.animatedSprite(NPCActor, "Slime", "primary");
                        npc.position.set(1050+i*50, 1150+i*50);
                        npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(50, 30)), null, false);
                        this.TotalEnemies += 1;
                
                        // Give the NPC a healthbar
                        let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(1, 1/10), offset: npc.size.clone().scaled(0, -1/3)});
                        this.healthbars.set(npc.id, healthbar);
                        
                        // Set the NPCs stats
                        npc.battleGroup = 1;
                        npc.speed = 5;
                        npc.health = 5;
                        npc.maxHealth = 5;
                        npc.navkey = "navmesh";
                        npc.spawnpoint = npc.position.clone();
                        npc.addAI(GuardBehavior, {target: new BasicTargetable(new Position(npc.position.x, npc.position.y)), range: 300});
                        
                        // Play the NPCs "IDLE" animation
                        npc.animation.play("IDLE");
                        // Add the NPC to the battlers array
                        this.battlers.push(npc);
                        this.enemies.push(npc);
                    }
                    
                    for (let i = 0; i < 4; i++) {
                        let npc = this.add.animatedSprite(NPCActor, "Moondog", "primary");
                        npc.position.set(1050+i*50, 1350+i*50);
                        npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(50, 30)), null, false);
                        this.TotalEnemies += 1;
                
                        // Give the NPC a healthbar
                        let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(1, 1/10), offset: npc.size.clone().scaled(0, -1/3)});
                        this.healthbars.set(npc.id, healthbar);
                        
                        // Set the NPCs stats
                        npc.battleGroup = 1;
                        npc.speed = 5;
                        npc.health = 5;
                        npc.maxHealth = 5;
                        npc.navkey = "navmesh";
                        npc.spawnpoint = npc.position.clone();
                        npc.addAI(GuardBehavior, {target: new BasicTargetable(new Position(npc.position.x, npc.position.y)), range: 300});
                        
                        // Play the NPCs "IDLE" animation
                        npc.animation.play("IDLE");
                        // Add the NPC to the battlers array
                        this.battlers.push(npc);
                        this.enemies.push(npc);
                    }
                    this.count1 = 1;
                }
                else{
                    if(this.count2 < 1 || this.count4 == 2){
                        let npc = this.add.animatedSprite(NPCActor, "Firebreath", "primary");
                        npc.position.set(1250+this.count2*50, 1670);
                        //npc.rotation = 120
                        npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(100, 240)), null, false);
                        console.log(npc)
                        npc.animation.play("START");
                        projectiles.push(npc)
                        this.count2+=1
                        this.count3=0
                        this.count4=0
                    }
                    
                    
                }
                console.log(projectiles)
                for(const projectile of projectiles){
                    console.log(projectile.animation.isPlaying("START"))
                    if(!projectile.animation.isPlaying("START") && !projectile.animation.isPlaying("SUMMON") ){
                        projectile.animation.playIfNotAlready("CONTINUOUS");
                    }
                    this.count3 +=1
                    let aabb 
                    console.log(projectile.collisionShape.getBoundingRect())
                    console.log(this.player.collisionShape.getBoundingRect())
                    if(this.intersectAABB(projectile.collisionShape.getBoundingRect(), this.player.collisionShape.getBoundingRect())){
                        console.log("in fire breath")
                        this.player.health -= 1
                    }
                    
                    if(this.count3 >= 10){
                        projectile.destroy();
                        projectiles.splice(projectiles.indexOf(projectile), 1)
                        this.count4 = 1
                    }
                    
                    console.log(this.count3)
                }
                if(this.count4 == 1){
                    this.count3 -= 2
                    if(this.count3 <= 0){
                        this.count4 = 2
                        this.count2 = 0
                    }
                }
            }
            else if(this.phase == 4){
                if(this.dragon.health <= 0){
                    this.phase = 5;
                    this.count1 = 0;
                    this.count2 = 0;
                    //this.count3 = 0;
                    //this.count4 = 0;
                }
                if(this.count1 == 0){
                    this.dragon.animation.play("SUMMON");
                    await this.delay(2000);
                    for (let i = 0; i < 4; i++) {
                        let npc = this.add.animatedSprite(NPCActor, "Slime", "primary");
                        npc.position.set(1050+i*50, 1150+i*50);
                        npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(50, 30)), null, false);
                        this.TotalEnemies += 1;
                
                        // Give the NPC a healthbar
                        let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(1, 1/10), offset: npc.size.clone().scaled(0, -1/3)});
                        this.healthbars.set(npc.id, healthbar);
                        
                        // Set the NPCs stats
                        npc.battleGroup = 1;
                        npc.speed = 5;
                        npc.health = 5;
                        npc.maxHealth = 5;
                        npc.navkey = "navmesh";
                        npc.spawnpoint = npc.position.clone();
                        npc.addAI(GuardBehavior, {target: new BasicTargetable(new Position(npc.position.x, npc.position.y)), range: 300});
                        
                        // Play the NPCs "IDLE" animation
                        npc.animation.play("IDLE");
                        // Add the NPC to the battlers array
                        this.battlers.push(npc);
                        this.enemies.push(npc);
                    }
                    
                    for (let i = 0; i < 4; i++) {
                        let npc = this.add.animatedSprite(NPCActor, "Moondog", "primary");
                        npc.position.set(1050+i*50, 1350+i*50);
                        npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(50, 30)), null, false);
                        this.TotalEnemies += 1;
                
                        // Give the NPC a healthbar
                        let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(1, 1/10), offset: npc.size.clone().scaled(0, -1/3)});
                        this.healthbars.set(npc.id, healthbar);
                        
                        // Set the NPCs stats
                        npc.battleGroup = 1;
                        npc.speed = 5;
                        npc.health = 5;
                        npc.maxHealth = 5;
                        npc.navkey = "navmesh";
                        npc.spawnpoint = npc.position.clone();
                        npc.addAI(GuardBehavior, {target: new BasicTargetable(new Position(npc.position.x, npc.position.y)), range: 300});
                        
                        // Play the NPCs "IDLE" animation
                        npc.animation.play("IDLE");
                        // Add the NPC to the battlers array
                        this.battlers.push(npc);
                        this.enemies.push(npc);
                    }
                    this.count1 = 1;
                }
                else{
                    if(this.count2 < 1 || this.count4 == 2){
                        let npc = this.add.animatedSprite(NPCActor, "Firebreath", "primary");
                        npc.position.set(1250+this.count2*50, 1670);
                        //npc.rotation = 120
                        npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(100, 240)), null, false);
                        console.log(npc)
                        npc.animation.play("START");
                        projectiles.push(npc)
                        this.count2+=1
                        this.count3=0
                        this.count4=0
                    }
                    
                    
                }
                console.log(projectiles)
                for(const projectile of projectiles){
                    console.log(projectile.animation.isPlaying("START"))
                    if(!projectile.animation.isPlaying("START") && !projectile.animation.isPlaying("SUMMON") ){
                        projectile.animation.playIfNotAlready("CONTINUOUS");
                    }
                    this.count3 +=1
                    let aabb 
                    console.log(projectile.collisionShape.getBoundingRect())
                    console.log(this.player.collisionShape.getBoundingRect())
                    if(this.intersectAABB(projectile.collisionShape.getBoundingRect(), this.player.collisionShape.getBoundingRect())){
                        console.log("in fire breath")
                        this.player.health -= 1
                    }
                    
                    if(this.count3 >= 10){
                        projectile.destroy();
                        projectiles.splice(projectiles.indexOf(projectile), 1)
                        this.count4 = 1
                    }
                    
                    console.log(this.count3)
                }
                if(this.count4 == 1){
                    this.count3 -= 2
                    if(this.count3 <= 0){
                        this.count4 = 2
                        this.count2 = 0
                    }
                }
            }
            else if(this.phase == 5){
                this.dragon.destroy();
                projectiles.splice(0, projectiles.length)
            }
        }
    }
    async delay(ms: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    /**
     * @see Scene.updateScene
    */
    public updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
    
    /**
     * Handle events from the rest of the game
     * @param event a game event
     */
    public handleEvent(event: GameEvent): void {
        switch (event.type) {
        }
    }

    handledetections() {
        for(let enemy of this.battlers.slice(1)) {
            if(lvl6Scene.checkifDetected(this.battlers[0], enemy)) {
                enemy.addAI(GuardBehavior, {target: this.battlers[0], range: 10});
            }
        }
    }
    /**
     * Handles an NPC being killed by unregistering the NPC from the scenes subsystems
     * @param event an NPC-killed event
     */


    /** Initializes the layers in the scene */
    protected initLayers(): void {
        this.addLayer("primary", 10);
        
    }
    
        
    

    /**
     * Initializes the player in the scene
     */
    protected initializePlayer(): void {
        let player = this.add.animatedSprite(PlayerActor, "player1", "primary");
        player.position.set(200, 2000);
        player.battleGroup = 2;

        player.health = 10;
        player.maxHealth = 10;
        player.speed = 50;
        // Give the player physics
        player.addPhysics(new AABB(Vec2.ZERO, new Vec2(32, 64)));

        // Give the player a healthbar
        let healthbar = new StaticHealthbarHUD(this, player, "lvlScene",  {size:new Vec2(300,30), location: new Vec2 (246,68)});
        this.StaticHealthbars.set(player.id, healthbar);

        // Give the player PlayerAI
        player.addAI(PlayerAI);

        // Start the player in the "IDLE" animation
        player.animation.play("IDLE");

        this.battlers.push(player);
        this.viewport.follow(player);
        this.player=player
    }
    /**
     * Initialize the NPCs 
     */
    protected initializeNPCs(): void {
        let dragon = this.load.getObject("dragons");
        
            let npc = this.add.animatedSprite(NPCActor, "Dragon", "primary");
            npc.position.set(dragon.dragons[0][0], dragon.dragons[0][1]);
            npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(200, 300)), null, false);
            this.TotalEnemies += 1;
    
            // Give the NPC a healthbar
            let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(1, 1/10), offset: npc.size.clone().scaled(0, -1/3)});
            this.healthbars.set(npc.id, healthbar);
            
            // Set the NPCs stats
            npc.battleGroup = 1;
            npc.speed = 5;
            npc.health = 100;
            npc.maxHealth = 100;
            npc.navkey = "navmesh";
            npc.spawnpoint = npc.position.clone();
            npc.addAI(DragonBehavior, {});

            npc.animation.play("IDLE");
            this.battlers.push(npc);
            this.enemies.push(npc);
            this.dragon = npc
        
    }

    protected initializeNavmesh(): void {
            // Create the graph
            this.graph = new PositionGraph();
        
            let dim: Vec2 = this.walls.getDimensions();
            for (let i = 0; i < dim.y; i++) {
                for (let j = 0; j < dim.x; j++) {
                    let tile: AABB = this.walls.getTileCollider(j, i);
                    this.graph.addPositionedNode(tile.center);
                }
            }
        
            let rc: Vec2;
            for (let i = 0; i < this.graph.numVertices; i++) {
                rc = this.walls.getTileColRow(i);
                if (!this.walls.isTileCollidable(rc.x, rc.y)) {
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dy = -1; dy <= 1; dy++) {
                            if (dx !== 0 || dy !== 0) { // Exclude the current tile
                                // Skip diagonals if they would intersect with collidable tiles
                                let skipDiagonal = (dx !== 0 && dy !== 0) &&
                                    (this.walls.isTileCollidable(rc.x + dx, rc.y) ||
                                    this.walls.isTileCollidable(rc.x, rc.y + dy));
        
                                if (!skipDiagonal) {
                                    let neighborX = rc.x + dx;
                                    let neighborY = rc.y + dy;
                                    if (neighborX >= 0 && neighborX < dim.x && neighborY >= 0 && neighborY < dim.y) {
                                        let neighborIndex = this.walls.getTileIndex(neighborX, neighborY);
                                        if (!this.walls.isTileCollidable(neighborX, neighborY)) {
                                            // Create edge to the neighbor
                                            this.graph.addEdge(i, neighborIndex);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        
            // Set this graph as a navigable entity
            let navmesh = new Navmesh(this.graph);
            
            // Add different strategies to use for this navmesh
            navmesh.registerStrategy("direct", new DirectStrategy(navmesh));
            navmesh.registerStrategy("astar", new AstarStrategy(navmesh));
        
            // TODO set the strategy to use A* pathfinding
            navmesh.setStrategy("astar");
        
            // Add this navmesh to the navigation manager
            this.navManager.addNavigableEntity("navmesh", navmesh);
        }


    public getBattlers(): Battler[] { return this.battlers; }

    public getWalls(): OrthogonalTilemap { return this.walls; }

    /**
     * Checks if the given target position is visible from the given position.
     * @param position 
     * @param target 
     * @returns 
     */
    public isTargetVisible(position: Vec2, target: Vec2): boolean {

        // Get the new player location
        let start = position.clone();
        let delta = target.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, target.x);
        let maxX = Math.max(start.x, target.x);
        let minY = Math.min(start.y, target.y);
        let maxY = Math.max(start.y, target.y);

        // Get the wall tilemap
        let walls = this.getWalls();

        let minIndex = walls.getTilemapPosition(minX, minY);
        let maxIndex = walls.getTilemapPosition(maxX, maxY);

        let tileSize = walls.getScaledTileSize();

        for (let col = minIndex.x; col <= maxIndex.x; col++) {
            for (let row = minIndex.y; row <= maxIndex.y; row++) {
                if (walls.isTileCollidable(col, row)) {
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x / 2, row * tileSize.y + tileSize.y / 2);

                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1 / 2));

                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                    if (hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(target)) {
                        // We hit a wall, we can't see the player
                        return false;
                    }
                }
            }
        }
        return true;

    }
	static checkifDetected(Player: Battler, Enemy: Battler): boolean {
		// Your code goes here:
		let distx = Player.position.x - Enemy.position.x;
        let disty = Player.position.y - Enemy.position.y;
        if((Math.pow(distx, 2) + Math.pow(disty, 2)) < 5000) {
            return true
        }
		return false;
    }
    public intersectAABB(box: AABB, box2:AABB): Hit | null {
        const dx = box.center.x - box2.center.x;
        const px = (box.halfSize.x + box2.halfSize.x) - abs(dx);
        if (px <= 0) {
          return null;
        }
    
        const dy = box.center.y - box2.center.y;
        const py = (box.halfSize.y + box2.halfSize.y) - abs(dy);
        if (py <= 0) {
          return null;
        }
    
        const hit = new Hit(box2);
        if (px < py) {
          const sx = sign(dx);
          hit.delta.x = px * sx;
          hit.normal.x = sx;
          hit.pos.x = box2.center.x + (box2.halfSize.x * sx);
          hit.pos.y = box.center.y;
        } else {
          const sy = sign(dy);
          hit.delta.y = py * sy;
          hit.normal.y = sy;
          hit.pos.x = box.center.x;
          hit.pos.y = box2.center.y + (box2.halfSize.y * sy);
        }
        return hit;
      }
    
   
}
type Collider = AABB;
 class Point{
    public x: number;
    public y: number;
  
    constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
    }
}
export function abs(value: number): number {
    return value < 0 ? -value : value;
  }
export function sign(value: number): number {
    return value < 0 ? -1 : 1;
}

 class Hit {
    
    public collider: Collider;
    public pos: Point;
    public delta: Point;
    public normal: Point;
    public time: number;
  
    constructor(collider: Collider) {
      this.collider = collider;
      this.pos = new Point();
      this.delta = new Point();
      this.normal = new Point();
      this.time = 0;
    }
  }