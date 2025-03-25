import { VpNode } from "./VpNode";

interface MeshElementData {
  id: number;
  nodes: number[];
}

export class MeshElement implements MeshElementData {
  id: number;
  nodes: number[];

  constructor(id: number, nodes: number[]) {
    this.id = id;
    this.nodes = nodes;
  }

  getNodes(nodeMap: Map<number, VpNode>): VpNode[] {
    return this.nodes
      .map((nodeId) => nodeMap.get(nodeId))
      .filter((node) => node !== undefined) as VpNode[];
  }
}
