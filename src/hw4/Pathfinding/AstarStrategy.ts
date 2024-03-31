import Stack from "../../Wolfie2D/DataTypes/Collections/Stack";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import NavPathStrat from "../../Wolfie2D/Pathfinding/Strategies/NavigationStrategy";
import GraphUtils from "../../Wolfie2D/Utils/GraphUtils";

// TODO Construct a NavigationPath object using A*

/**
 * The AstarStrategy class is an extension of the abstract NavPathStrategy class. For our navigation system, you can
 * now specify and define your own pathfinding strategy. Originally, the two options were to use Djikstras or a
 * direct (point A -> point B) strategy. The only way to change how the pathfinding was done was by hard-coding things
 * into the classes associated with the navigation system. 
 * 
 * - Peter
 */


function h(start, end, mesh) {
    // console.log("bleh: ", mesh.graph.getNodePosition(start));
    return mesh.graph.getNodePosition(start).distanceTo(mesh.graph.getNodePosition(end));
}
class PriorityQueue {
    private queue: {fscore, node}[];

    constructor() {
        this.queue = [];
    }

    enqueue(node, fscore): void {
        this.queue.push({node, fscore});
    }

    dequeue() {
        if (this.isEmpty()) {
            return undefined;
        }
        let min = 0;
        for (let i = 1; i < this.queue.length; i++) {
            if (this.queue[i].fscore < this.queue[min].fscore) {
                min = i;
            }
        }
        const mindNode = this.queue[min].node;
        this.queue.splice(min, 1);
        return mindNode;
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

export default class AstarStrategy extends NavPathStrat {
    public buildPath(to: Vec2, from: Vec2): NavigationPath {
        const start = this.mesh.graph.snap(from);
        const target = this.mesh.graph.snap(to);

        let parents = new Map<number, number>();
        let gscore = new Map<number, number>();
        let openset = new PriorityQueue();
        gscore.set(start, 0);
        openset.enqueue(start, 0);

        while (!openset.isEmpty()) {
            const curr = openset.dequeue();
            if (curr === target) {
                break;
            }

            let edges = this.mesh.graph.edges[curr];
            while (edges != null && edges !== undefined) {
                const neighbor = edges.y;
                const tentative_gscore = gscore.get(curr) + edges.weight;
                
                if (!gscore.has(neighbor) || tentative_gscore < gscore.get(neighbor)) {
                    gscore.set(neighbor, tentative_gscore);
                    parents.set(neighbor, curr);
                    const fScore = tentative_gscore + h(neighbor, target, this.mesh);
                    openset.enqueue(neighbor, fScore);
                }
                edges = edges.next;
            }
        }

        let path = new Stack<Vec2>(this.mesh.graph.numVertices);
        let current = target;
        while (parents.has(current)) {
            path.push(this.mesh.graph.getNodePosition(current));
            current = parents.get(current);
        }
        path.push(from);
        return new NavigationPath(path);
    }
}