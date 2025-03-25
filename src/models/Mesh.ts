import { MeshElement, VpNode } from ".";

interface MeshData {
  nodes: VpNode[];
  elements: MeshElement[];
  values: VpValueData[];
}

export class Mesh implements MeshData {
  nodes: VpNode[];
  elements: MeshElement[];
  values: VpValueData[];

  private nodeMap: Map<number, VpNode>;
  private elemMap: Map<number, MeshElement>;

  constructor(nodes: VpNode[], elements: MeshElement[], values: VpValueData[]) {
    this.nodes = nodes;
    this.elements = elements;
    this.values = values;

    this.nodeMap = new Map(
      nodes.map((node) => [node.id, new VpNode(node.id, node.x, node.y)])
    );
    this.elemMap = new Map(
      elements.map((element) => [
        element.id,
        new MeshElement(element.id, element.nodes),
      ])
    );
  }

  getMeshElement(id: number): MeshElement {
    return this.elemMap.get(id)!;
  }

  getVpNode(id: number): VpNode {
    return this.nodeMap.get(id)!;
  }

  getSortedViewSpots() {
    const sortedVals = [...this.values].sort((a, b) => b.value - a.value);
    return sortedVals;
  }

  private isNeighbour(nodesA: number[], nodesB: number[]): boolean {
    return nodesA.some((node) => nodesB.includes(node));
  }

  excludeNeighbours(
    sortedViewSpots: VpValueData[],
    maxViewSpots: number
  ): VpValueData[] {
    const uniqueViewSpots: VpValueData[] = [];
    for (const spot of sortedViewSpots) {
      if (uniqueViewSpots.length == maxViewSpots) break;

      const currentSpot = this.getMeshElement(spot.element_id);

      const isNeighbour = uniqueViewSpots.some((uniqueViewSpot) => {
        const identifiedViewSpot = this.getMeshElement(
          uniqueViewSpot.element_id
        );
        return this.isNeighbour(currentSpot.nodes, identifiedViewSpot.nodes);
      });

      if (!isNeighbour) uniqueViewSpots.push(spot);
    }
    return uniqueViewSpots;
  }

  getViewSpots(viewSpots: number) {
    const sortedViewSpots = this.getSortedViewSpots();
    return this.excludeNeighbours(sortedViewSpots, viewSpots);
  }
}
