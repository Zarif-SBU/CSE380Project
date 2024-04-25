import PositionGraph from "../../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Actor from "../../../Wolfie2D/DataTypes/Interfaces/Actor";
import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Navmesh from "../../../Wolfie2D/Pathfinding/Navmesh";
import DirectStrategy from "../../../Wolfie2D/Pathfinding/Strategies/DirectStrategy";
import RenderingManager from "../../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../../Wolfie2D/Timing/Timer";

import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import GuardBehavior from "../../AI/NPC/NPCBehavior/GaurdBehavior";
import Wolfbehavior from "../../AI/NPC/NPCBehavior/WolfBehavior";
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
import lvl4Scene from "./lvl4Scene";

const BattlerGroups = {
    RED: 1,
    BLUE: 2
} as const;

export default class lvl3Scene extends HW4Scene {
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

    // The wall layer of the tilemap
    private walls: OrthogonalTilemap;

    // The position graph for the navmesh
    private graph: PositionGraph;

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);
        this.level = 1;
        this.battlers = new Array<Battler & Actor>();
        this.healthbars = new Map<number, HealthbarHUD>();
    }

    private timer: Timer;

    /**
     * @see Scene.update()
     */
    public override loadScene() {
        // Load the player and enemy spritesheets
        // this.load.spritesheet("player1", "hw4_assets/spritesheets/player1.json");
        this.load.spritesheet("player1", "hw4_assets/spritesheets/MainCharacter/MainCharacter1.json");

        // Load in the enemy sprites
       
        // this.load.spritesheet("Slime", "hw4_assets/spritesheets/RedEnemy.json");
        this.load.spritesheet("Slime", "hw4_assets/spritesheets/Enemies/BlackPudding/black_pudding.json");
        this.load.spritesheet("Moondog", "hw4_assets/spritesheets/Enemies/Moondog/moondog.json");
        this.load.audio("level_music", "hw4_assets/Audio/FillerMusic.mp3")
        this.load.audio("select", "hw4_assets/Audio/select.mp3");


        // Load the tilemap
        this.load.tilemap("level", "hw4_assets/tilemaps/lvl3.json");

        // Load the enemy locations
        this.load.object("slimes", "hw4_assets/data/enemies/slime.json");
        this.load.object("moondogs", "hw4_assets/data/enemies/Moondog.json");
        this.load.object("blue", "hw4_assets/data/enemies/blue.json");
    }
    /**
     * @see Scene.startScene
     */
    public override startScene() {
        this.currentLevel = lvl3Scene;
        this.nextLevel=lvl4Scene;
        this.LevelEnd = [new Vec2(2076, 192), new Vec2(2214, 192)];
        // Add in the tilemap
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "select", loop: false, holdReference: true});
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});

        let tilemapLayers = this.add.tilemap("level");
        
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
        
        let PauseCount = 1;
        
        window.addEventListener('keydown', (event) => {
            if (event.key === "Escape" && PauseCount % 2 != 0) {
                PauseCount++;
                this.pauseGame();
                super.startScene();
                
            }else if (event.key === "Escape" && PauseCount % 2 == 0) {
                PauseCount--;
                this.resumeGame();
    
            }
        });
    }
    

    private pauseGame(){
        this.timer.pause();
        console.log("game paused")
    }

    private resumeGame(){
        this.timer.start()
        console.log("game resumed")
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
            if(lvl3Scene.checkifDetected(this.battlers[0], enemy)) {
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
        player.position.set(2200, 1950);
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

        for (let i = 0; i < moondog.moondogs.length; i++) {
            let npc = this.add.animatedSprite(NPCActor, "Moondog", "primary");
            npc.position.set(moondog.moondogs[i][0], moondog.moondogs[i][1]);
            npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(50, 30)), null, false);
            this.TotalEnemies +=1;

            // Give the NPC a healthbar
            let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(1, 1/10), offset: npc.size.clone().scaled(0, -1/3)});
            this.healthbars.set(npc.id, healthbar);
            
            // Set the NPCs stats
            npc.battleGroup = 1;
            npc.speed = 10;
            npc.health = 3;
            npc.maxHealth = 3;
            npc.navkey = "navmesh";
            npc.spawnpoint = npc.position.clone();
            // console.log("spawn point", npc.spawnpoint);
            // npc.spawnPosition = new Vec2(npc.position.x, npc.position.y);
            npc.addAI(Wolfbehavior, {target: new BasicTargetable(new Position(npc.position.x, npc.position.y)), range: 300});
            
            // Play the NPCs "IDLE" animation
            npc.animation.play("IDLE");
            // Add the NPC to the battlers array
            this.battlers.push(npc);
            this.enemies.push(npc)
        }

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
}