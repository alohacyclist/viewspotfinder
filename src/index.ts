import { readFileSync, writeFileSync } from "fs";
import { Mesh } from "./models";
import { validateMesh } from "./utils/validateMesh";
import { log } from "./utils/log";
import { Constants } from "./utils/constants";

function main() {
  const allArgs = process.argv;
  if (allArgs.length != Constants.TOTAL_ARGUMENTS)
    throw new Error(
      `${Constants.TOTAL_ARGUMENTS} arguments expected -> Usage: bun run index.ts <mesh file> <number of view spots>`
    );

  const args = allArgs.slice(-Constants.WORKING_ARGS);
  const meshFile = args[0];
  const viewSpots = parseInt(args[1]);

  if (isNaN(viewSpots) || viewSpots <= 0) {
    log(
      "warn",
      "<number of view spots> must be a positive integer -> All view spots will be returned!"
    );
  }

  const fileContent = readFileSync(meshFile, "utf-8");
  const meshData: Mesh = JSON.parse(fileContent);

  if (!validateMesh(meshData)) throw new Error("Invalid mesh JSON structure.");

  log("info", `Successfully read JSON mesh file: ${meshFile}`);

  const mesh: Mesh = new Mesh(
    meshData.nodes,
    meshData.elements,
    meshData.values
  );

  const viewSpotResults = mesh.getViewSpots(viewSpots);

  if (viewSpots > meshData.values.length || viewSpotResults.length < viewSpots)
    log(
      "warn",
      `The dataset does not contain the given number of viewspots -> All view spots will be returned!`
    );

  const json = JSON.stringify(viewSpotResults);
  log("success", json);

  writeFileSync(Constants.OUTPUT_RESULTS, json, "utf-8");

  log(
    "info",
    `Successfully saved ${viewSpotResults.length} view spots in ${Constants.OUTPUT_RESULTS}`
  );
}

try {
  main();
} catch (error: any) {
  log("error", error.message);
}
