import fs from "fs";
import path from "path";
import {expect} from "chai";
import {ssz} from "@lodestar/types";
import {migrateState} from "../../../src/util/migrateState.js";

describe("migrateState", function () {
  this.timeout(0);
  const stateType = ssz.capella.BeaconState;

  const folder = "/Users/tuyennguyen/tuyen/state_migration";
  const data = Uint8Array.from(fs.readFileSync(path.join(folder, "mainnet_state_6543072.ssz")));
  console.log("@@@ number of bytes", data.length);
  let startTime = Date.now();
  const heapUsed = process.memoryUsage().heapUsed;

  const seedState = stateType.deserializeToViewDU(data);
  console.log(
    "@@@ loaded state slot",
    seedState.slot,
    "to TreeViewDU in",
    Date.now() - startTime,
    "ms",
    "heapUse",
    bytesToSize(process.memoryUsage().heapUsed - heapUsed)
  );
  // cache all HashObjects
  startTime = Date.now();
  const stateRoot = seedState.hashTreeRoot();
  console.log("@@@ hashTreeRoot of old state in", Date.now() - startTime, "ms");

  it("migrate same state", () => {
    let startTime = Date.now();
    const newState = migrateState(seedState, data);
    console.log("@@@ migrate state in", Date.now() - startTime, "ms");
    startTime = Date.now();
    expect(ssz.Root.equals(newState.hashTreeRoot(), stateRoot)).to.be.true;
    console.log("@@@ hashTreeRoot of new state in", Date.now() - startTime, "ms");
  });
});

function bytesToSize(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(2);
  return `${size} ${sizes[i]}`;
}
