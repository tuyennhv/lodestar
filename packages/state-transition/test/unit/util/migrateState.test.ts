import fs from "fs";
import path from "path";
import {expect} from "chai";
import bls from "@chainsafe/bls";
import {CoordType} from "@chainsafe/blst";
import {ssz} from "@lodestar/types";
import {config as defaultChainConfig} from "@lodestar/config/default";
import {createBeaconConfig} from "@lodestar/config";
import {migrateState} from "../../../src/util/migrateState.js";
import {createCachedBeaconState} from "../../../src/cache/stateCache.js";
import {Index2PubkeyCache, PubkeyIndexMap} from "../../../src/cache/pubkeyCache.js";

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
  const config = createBeaconConfig(defaultChainConfig, seedState.genesisValidatorsRoot);
  startTime = Date.now();
  // TODO: EIP-6110 - need to create 2 separate caches?
  const pubkey2index = new PubkeyIndexMap();
  const index2pubkey: Index2PubkeyCache = [];
  const cachedSeedState = createCachedBeaconState(seedState, {
    config,
    pubkey2index,
    index2pubkey,
  });
  console.log("@@@ createCachedBeaconState in", Date.now() - startTime, "ms");

  it("migrate same state", () => {
    let startTime = Date.now();
    const modifiedValidators: number[] = [];
    const newState = migrateState(seedState, data, modifiedValidators);
    console.log("@@@ migrate state in", Date.now() - startTime, "ms");
    startTime = Date.now();
    expect(ssz.Root.equals(newState.hashTreeRoot(), stateRoot)).to.be.true;
    console.log("@@@ hashTreeRoot of new state in", Date.now() - startTime, "ms");
    startTime = Date.now();
    // Get the validators sub tree once for all the loop
    const validators = newState.validators;
    for (const validatorIndex of modifiedValidators) {
      const validator = validators.getReadonly(validatorIndex);
      const pubkey = validator.pubkey;
      pubkey2index.set(pubkey, validatorIndex);
      index2pubkey[validatorIndex] = bls.PublicKey.fromBytes(pubkey, CoordType.jacobian);
    }
    createCachedBeaconState(
      newState,
      {
        config,
        pubkey2index,
        index2pubkey,
        // TODO: maintain a ShufflingCache given an epoch and dependentRoot to avoid recompute shuffling
        previousShuffling: cachedSeedState.epochCtx.previousShuffling,
        currentShuffling: cachedSeedState.epochCtx.currentShuffling,
        nextShuffling: cachedSeedState.epochCtx.nextShuffling,
      },
      // TODO: skip sync commitee cache in some conditions
      {skipSyncPubkeys: true, skipComputeShuffling: true}
    );
  });
});

function bytesToSize(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(2);
  return `${size} ${sizes[i]}`;
}
