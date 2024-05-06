export enum BattlerEvent {
    BATTLER_KILLED = "BATTLER_KILLED",
    BATTLER_RESPAWN = "BATTLER_RESPAWN",
    
    BATTLER_CHANGE = "BATTLER_CHANGE",
    CONSUME = "CONSUME",
    HIT = "HIT",
    ATTACK = "ATTACK",
}


export enum PlayerEvent{
    LIGHT_ATTACK = "LIGHT_ATTACK",
    HEAVY_ATTACK = "HEAVY_ATTACK",
    BLOCK = "BLOCK",
    HIT = "HIT",
    PLAYER_MOVE = "PLAYER_MOVE",
}


export enum HudEvent {
    HEALTH_CHANGE = "HEALTH_CHANGE"
}

export enum PlayerEvent {
    PLAYER_KILLED = "PLAYER_KILLED",
    PLAYER_ATTACKING = "PLAYER_ATTACKING"
}

export enum LevelEvent{
    PLAYER_ENTERED_LEVEL_END = "PlayerEnteredLevelEnd",
    
}