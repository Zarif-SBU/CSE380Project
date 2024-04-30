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
import SceneManager from "../../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../../Wolfie2D/Timing/Timer";
import GuardBehavior from "../../AI/NPC/NPCBehavior/GaurdBehavior";
import PlayerAI from "../../AI/Player/PlayerAI";
import NPCActor from "../../Actors/NPCActor";
import PlayerActor from "../../Actors/PlayerActor";
import { BattlerEvent, PlayerEvent } from "../../Events";
import Battler from "../../GameSystems/BattleSystem/Battler";
import BattlerBase from "../../GameSystems/BattleSystem/BattlerBase";
import HealthbarHUD from "../../GameSystems/HUD/HealthbarHUD";
import BasicTargetable from "../../GameSystems/Targeting/BasicTargetable";
import Position from "../../GameSystems/Targeting/Position";
import AstarStrategy from "../../Pathfinding/AstarStrategy";
import HW4Scene from "../HW4Scene";
import lvl2Scene from "./lvl2Scene";

const BattlerGroups = {
    RED: 1,
    BLUE: 2
} as const;

export default class lvl1Scene extends HW4Scene {
    public level: number;

    /** GameSystems in the HW4 Scene */

    /** All the battlers in the HW4Scene (including the player) */
    private battlers: (Battler & Actor)[];
    /** Healthbars for the battlers */
    protected healthbars: Map<number, HealthbarHUD>;

    private bases: BattlerBase[];

    protected player:PlayerActor;

    protected TotalEnemies: 0;
    protected enemies:Battler[] = [];
    protected door = false;
    

    // The wall layer of the tilemap
    private walls: OrthogonalTilemap;
    protected doorAudioPlayed: boolean;

    // The position graph for the navmesh
    private graph: PositionGraph;

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);
        this.battlers = new Array<Battler & Actor>();
        this.healthbars = new Map<number, HealthbarHUD>();
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
        // Load in the enemy sprites
        // this.load.spritesheet("Slime", "hw4_assets/spritesheets/RedEnemy.json");
        this.load.spritesheet("Slime", "hw4_assets/spritesheets/Enemies/BlackPudding/black_pudding.json");
        this.load.spritesheet("Moondog", "hw4_assets/spritesheets/Enemies/Moondog/moondog.json");
        
        //this.load.audio("level_music", "hw4_assets/Audio/FillerMusic.mp3");
        this.load.audio("select", "hw4_assets/Audio/select.mp3");
        this.load.audio("lvl1music", "hw4_assets/Audio/lvl1.mp3");
        this.load.audio("heavy","hw4_assets/Audio/SoundEffects/heavy_attack.mp3") 
        this.load.audio("heavy","hw4_assets/Audio/SoundEffects/light_attack.mp3") 

        // Load the tilemap
        this.load.tilemap("level", "hw4_assets/tilemaps/lvl1.json");

        // Load the enemy locations
        this.load.object("slimes", "hw4_assets/data/enemies/slime.json");
        this.load.object("moondogs", "hw4_assets/data/enemies/Moondog.json");
        this.load.object("blue", "hw4_assets/data/enemies/blue.json");
    }
    /**
     * @see Scene.startScene
     */
    public override startScene() {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "level_music" });
        this.emitter.fireEvent(GameEventType.PLAY_MUSIC,{key:"lvl1music", loop: true, holdReference: true})
        this.doorAudioPlayed = false;
        this.currentLevel = lvl1Scene;
        this.nextLevel=lvl2Scene;
        this.lvlScene = this.addUILayer("lvlScene")
        this.LevelEnd = [new Vec2(3878, 384), new Vec2(4008, 384)];//range of where the door is
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "select", loop: false, holdReference: true});
        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");
        this.tilemap = <OrthogonalTilemap>tilemapLayers[0].getItems()[0];
        
        // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];
        
        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;
        
        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
        this.viewport.setZoomLevel(1);
        
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
            if(lvl1Scene.checkifDetected(this.battlers[0], enemy)) {
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
        player.position.set(200, 1100);
        player.battleGroup = 2;

        player.health = 10;
        player.maxHealth = 10;
        player.speed = 50;
        // Give the player physics
        player.addPhysics(new AABB(Vec2.ZERO, new Vec2(32, 64)));

        // Give the player a healthbar
        let healthbar = new HealthbarHUD(this, player, "primary", {size: player.size.clone().scaled(1, 1/10), offset: player.size.clone().scaled(0, -2/3)});
        this.healthbars.set(player.id, healthbar);

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

        // Get the object data for the red enemies
        let slime = this.load.getObject("slimes");
        let moondog = this.load.getObject("moondogs");

        for (let i = 0; i < slime.slimes.length; i++) {
            let npc = this.add.animatedSprite(NPCActor, "Slime", "primary");
            npc.position.set(slime.slimes[i][0], slime.slimes[i][1]);
            npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(50, 30)), null, false);
            this.TotalEnemies +=1;

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
            // console.log("spawn point", npc.spawnpoint);
            // npc.spawnPosition = new Vec2(npc.position.x, npc.position.y);
            npc.addAI(GuardBehavior, {target: new BasicTargetable(new Position(npc.position.x, npc.position.y)), range: 300});
            
            // Play the NPCs "IDLE" animation
            npc.animation.play("IDLE");
            // Add the NPC to the battlers array
            this.battlers.push(npc);
            this.enemies.push(npc)
        }
        //console.log("enemies in level 1",this.enemies)

        // for (let i = 0; i < moondog.moondogs.length; i++) {
        //     let npc = this.add.animatedSprite(NPCActor, "Moondog", "primary");
        //     npc.position.set(moondog.moondogs[i][0], moondog.moondogs[i][1]);
        //     npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(50, 30)), null, false);

        //     // Give the NPC a healthbar
        //     let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(1, 1/10), offset: npc.size.clone().scaled(0, -1/3)});
        //     this.healthbars.set(npc.id, healthbar);
            
        //     // Set the NPCs stats
        //     npc.battleGroup = 1;
        //     npc.speed = 5;
        //     npc.health = 5;
        //     npc.maxHealth = 5;
        //     npc.navkey = "navmesh";
        //     npc.spawnpoint = npc.position.clone();
        //     console.log("spawn point", npc.spawnpoint);
        //     // npc.spawnPosition = new Vec2(npc.position.x, npc.position.y);
        //     npc.addAI(Wolfbehavior, {target: new BasicTargetable(new Position(npc.position.x, npc.position.y)), range: 300});
            
        //     // Play the NPCs "IDLE" animation
        //     npc.animation.play("IDLE");
        //     // Add the NPC to the battlers array
        //     this.battlers.push(npc);
        // }
        // // Get the object data for the blue enemies
        // let blue = this.load.getObject("blue");

        // // Initialize the blue enemies
        // for (let i = 0; i < blue.enemies.length; i++) {
        //     let npc = this.add.animatedSprite(NPCActor, "BlueEnemy", "primary");
        //     npc.position.set(blue.enemies[i][0], blue.enemies[i][1]);
        //     npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);

        //     // Give the NPCS their healthbars
        //     let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(2, 1/2), offset: npc.size.clone().scaled(0, -1/2)});
        //     this.healthbars.set(npc.id, healthbar);

        //     npc.battleGroup = 2
        //     npc.speed = 10;
        //     npc.health = 1;
        //     npc.maxHealth = 10;
        //     npc.navkey = "navmesh";

        //     // Give the NPCs their AI
        //     npc.addAI(GuardBehavior, {target: this.battlers[0], range: 100});

        //     // Play the NPCs "IDLE" animation 
        //     npc.animation.play("IDLE");

        //     this.battlers.push(npc);
        // }

        // Initialize the blue healers
        // for (let i = 0; i < blue.healers.length; i++) {
            
        //     let npc = this.add.animatedSprite(NPCActor, "BlueHealer", "primary");
        //     npc.position.set(blue.healers[i][0], blue.healers[i][1]);
        //     npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);

        //     npc.battleGroup = 2;
        //     npc.speed = 10;
        //     npc.health = 1;
        //     npc.maxHealth = 10;
        //     npc.navkey = "navmesh";

        //     let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(2, 1/2), offset: npc.size.clone().scaled(0, -1/2)});
        //     this.healthbars.set(npc.id, healthbar);

        //     npc.addAI(HealerBehavior);
        //     npc.animation.play("IDLE");
        //     this.battlers.push(npc);
        // }


    }

    /**
     * Initialize the items in the scene (healthpacks and laser guns)
     */

    /**
     * Initializes the navmesh graph used by the NPCs in the HW4Scene. This method is a little buggy, and
     * and it skips over some of the positions on the tilemap. If you can fix my navmesh generation algorithm,
     * go for it.
     * 
     * - Peter
     */
    // protected initializeNavmesh(): void {
        // Create the graph
    //     this.graph = new PositionGraph();

    //     let dim: Vec2 = this.walls.getDimensions();
    //     for (let i = 0; i < dim.y; i++) {
    //         for (let j = 0; j < dim.x; j++) {
    //             let tile: AABB = this.walls.getTileCollider(j, i);
    //             this.graph.addPositionedNode(tile.center);
    //         }
    //     }

    //     let rc: Vec2;
    //     for (let i = 0; i < this.graph.numVertices; i++) {
    //         rc = this.walls.getTileColRow(i);
    //         if (!this.walls.isTileCollidable(rc.x, rc.y) &&
    //             !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), rc.y) &&
    //             !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), rc.y) &&
    //             !this.walls.isTileCollidable(rc.x, MathUtils.clamp(rc.y - 1, 0, dim.y - 1)) &&
    //             !this.walls.isTileCollidable(rc.x, MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
    //             !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
    //             !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
    //             !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), MathUtils.clamp(rc.y - 1, 0, dim.y - 1)) &&
    //             !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), MathUtils.clamp(rc.y - 1, 0, dim.y - 1))

    //         ) {
    //             // Create edge to the left
    //             rc = this.walls.getTileColRow(i + 1);
    //             if ((i + 1) % dim.x !== 0 && !this.walls.isTileCollidable(rc.x, rc.y)) {
    //                 this.graph.addEdge(i, i + 1);
    //                 // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + 1)})
    //             }
    //             // Create edge below
    //             rc = this.walls.getTileColRow(i + dim.x);
    //             if (i + dim.x < this.graph.numVertices && !this.walls.isTileCollidable(rc.x, rc.y)) {
    //                 this.graph.addEdge(i, i + dim.x);
    //                 // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + dim.x)})
    //             }
    //         }
    //     }

    //     // Set this graph as a navigable entity
    //     let navmesh = new Navmesh(this.graph);
        
    //     // Add different strategies to use for this navmesh
    //     navmesh.registerStrategy("direct", new DirectStrategy(navmesh));
    //     navmesh.registerStrategy("astar", new AstarStrategy(navmesh));

    //     // TODO set the strategy to use A* pathfinding
    //     navmesh.setStrategy("astar");

    //     // Add this navmesh to the navigation manager
    //     this.navManager.addNavigableEntity("navmesh", navmesh);
    // }

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
}