import Game from "./Wolfie2D/Loop/Game";
import { PlayerInput } from "./hw4/AI/Player/PlayerController";
import TitleScene from "./hw4/Scenes/BeginningScenes/TitleScene";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1200, y: 740},          // The size of the game
        clearColor: {r: 0.1, g: 0.1, b: 0.1},   // The color the game clears to
        inputs: [
            {name: PlayerInput.MOVE_UP, keys: ["w"]},
            {name: PlayerInput.MOVE_DOWN, keys: ["s"]},
            {name: PlayerInput.MOVE_LEFT, keys: ["a"]},
            {name: PlayerInput.MOVE_RIGHT, keys: ["d"]},
            {name: PlayerInput.PICKUP_ITEM, keys: ["e"]},
            {name: PlayerInput.DROP_ITEM, keys: ["q"]},
            {name: PlayerInput.DODGE, keys: ["shift"]},
            {name: PlayerInput.LIGHT_ATTACK, keys: ["j"]},
            {name: PlayerInput.HEAVY_ATTACK, keys: ["k"]},
            {name: PlayerInput.BLOCK, keys: ["l"]},
            //{name: PlayerInput.LIGHT_ATTACK, keys: ["z"]},
            //{name: PlayerInput.HEAVY_ATTACK, keys: ["x"]},
            //{name: PlayerInput.BLOCK, keys: ["c"]},
            {name: "slot1", keys: ["1"]},
            {name: "slot2", keys: ["2"]},
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                      // Whether to show debug messages. You can change this to true if you want
    }

    // Set up custom registries

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(TitleScene, {});

})();

function runTests(){};