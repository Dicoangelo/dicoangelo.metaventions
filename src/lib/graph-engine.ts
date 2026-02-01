export interface Node {
    id: string;
    label: string;
    type: 'concept' | 'tech' | 'metric' | 'outcome';
    metadata: Record<string, any>;
    connections: string[]; // Connected Node IDs
}

export interface Edge {
    source: string;
    target: string;
    weight: number;
    relation: string;
}

export class DeepGraphEngine {
    private nodes: Map<string, Node> = new Map();
    private edges: Edge[] = [];

    constructor(initialData?: { nodes: Node[], edges: Edge[] }) {
        if (initialData) {
            initialData.nodes.forEach(n => this.nodes.set(n.id, n));
            this.edges = initialData.edges;
        }
    }

    addNode(node: Node) {
        this.nodes.set(node.id, node);
    }

    addEdge(edge: Edge) {
        this.edges.push(edge);
        const source = this.nodes.get(edge.source);
        const target = this.nodes.get(edge.target);

        if (source && !source.connections.includes(edge.target)) source.connections.push(edge.target);
        if (target && !target.connections.includes(edge.source)) target.connections.push(edge.source);
    }

    // Basic reasoning: Find path between two nodes (BFS)
    findPath(startId: string, endId: string): string[] | null {
        const start = this.nodes.get(startId);
        if (!start) return null;

        const queue: [string, string[]][] = [[startId, [startId]]];
        const visited = new Set<string>();
        visited.add(startId);

        while (queue.length > 0) {
            const [current, path] = queue.shift()!;
            if (current === endId) return path;

            const node = this.nodes.get(current);
            if (node) {
                for (const neighbor of node.connections) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.push([neighbor, [...path, neighbor]]);
                    }
                }
            }
        }
        return null;
    }

    // Calculate Influence Score (Degree Centrality)
    getInfluenceScore(nodeId: string): number {
        const node = this.nodes.get(nodeId);
        return node ? node.connections.length : 0;
    }

    getAllNodes() {
        return Array.from(this.nodes.values());
    }

    getEdges() {
        return this.edges;
    }
}
