import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../Wolfie2D/Scene/Scene";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Battler from "../GameSystems/BattleSystem/Battler";


export default abstract class HW4Scene extends Scene {

    public abstract getBattlers(): Battler[];

    public abstract getWalls(): OrthogonalTilemap;


    public abstract isTargetVisible(position: Vec2, target: Vec2): boolean;
    
}