import {describe, it} from "vitest";
import {getStateTypeFromBytes} from "@lodestar/beacon-node";
import {downloadOrLoadFile} from "../../src/util/file.js";
import {createChainForkConfig} from "@lodestar/config";
import {holeskyChainConfig} from "@lodestar/config/networks";
import {toHex} from "@lodestar/utils";

describe("load_state", () => {
  const stateFilePath = "/Users/tuyennguyen/Downloads/holesky_finalized_state.ssz";
  it("should load state from file", async () => {
    const stateBytes = await downloadOrLoadFile(stateFilePath);
    const chainForkConfig = createChainForkConfig(holeskyChainConfig);
    const wsState = getStateTypeFromBytes(chainForkConfig, stateBytes).deserializeToViewDU(stateBytes);
    console.log("@@@ wsState", wsState.slot);
    console.log("@@@ hashTreeRoot", toHex(wsState.hashTreeRoot()));
  });
});
