interface NodeData {
  id: number;
  x: number;
  y: number;
}

export class VpNode implements NodeData {
  id: number;
  x: number;
  y: number;

  constructor(id: number, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
}
