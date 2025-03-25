import { describe, it, expect } from 'vitest';
import mesh from '../meshTest.json';
import { Constants } from '../src/utils';
import { Mesh, MeshElement, VpNode } from "../src/models";

function checkArguments(allArgs: string[]) {
    if (allArgs.length !== Constants.TOTAL_ARGUMENTS) {
      throw new Error(
        `${Constants.TOTAL_ARGUMENTS} arguments expected -> Usage: bun run index.ts <mesh file> <number of view spots>`
      );
    }
}

describe('Argument Check', () => {
    it('should throw an error if arguments count is incorrect', () => {
      expect(() => checkArguments([])).toThrowError(
        `${Constants.TOTAL_ARGUMENTS} arguments expected -> Usage: bun run index.ts <mesh file> <number of view spots>`
      );
  
      expect(() => checkArguments(['arg1'])).toThrowError();
      expect(() => checkArguments(['arg1', 'arg2'])).toThrowError();
      expect(() => checkArguments(['arg1', 'arg2', 'arg3'])).toThrowError();
      expect(() => checkArguments(['arg1', 'arg2', 'arg3', 'arg4'])).not.toThrow();
    });
  });
  
describe('Mesh JSON Data', () => {
  it('should have correct structure', () => {
    expect(mesh).toHaveProperty('nodes');
    expect(mesh).toHaveProperty('elements');
    expect(mesh).toHaveProperty('values');

    expect(Array.isArray(mesh.nodes)).toBe(true);
    expect(Array.isArray(mesh.elements)).toBe(true);
    expect(Array.isArray(mesh.values)).toBe(true);

    expect(mesh.nodes[0]).toEqual({ id: 0, x: 0.0, y: 0.0 });
    expect(mesh.elements[0]).toEqual({ id: 0, nodes: [0, 1, 12] });
    expect(mesh.values[0]).toEqual({ element_id: 0, value: 0.15154957113761364 });
  });
});

describe("Mesh getViewSpots", () => {
  it("should return the correct number of view spots without neighbors", () => {
    const nodes: VpNode[] = [
      new VpNode(0, 0.0, 0.0),
      new VpNode(1, 0.0, 1.0),
      new VpNode(2, 0.0, 2.0),
      new VpNode(11, 1.0, 0.0),
      new VpNode(12, 1.0, 1.0),
      new VpNode(13, 1.0, 2.0),
    ];

    const elements: MeshElement[] = [
      new MeshElement(0, [0, 1, 12]),
      new MeshElement(1, [0, 11, 12]),
      new MeshElement(2, [1, 2, 13]),
    ];

    const values: VpValue[] = [
      {element_id:0, value:0.8},
      {element_id:1, value:0.6},
      {element_id:2, value:0.9},
    ];

    const mesh = new Mesh(nodes, elements, values);

    const result = mesh.getViewSpots(2);

    expect(result.length).toBe(2);
    expect(result[0].value).toBe(0.9);
    expect(result[1].value).not.toBe(0.8);
  });
});


