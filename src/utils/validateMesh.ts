export function validateMesh(meshData: any) {
  return (
    Array.isArray(meshData.nodes) &&
    Array.isArray(meshData.elements) &&
    Array.isArray(meshData.values)
  );
}
