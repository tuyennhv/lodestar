import path from "node:path";
import fs from "node:fs";
import {itBench} from "@dapplion/benchmark";
import {config as defaultChainConfig} from "@lodestar/config/default";
import {bytesToInt} from "@lodestar/utils";
import {ChainForkConfig} from "@lodestar/config";
import {allForks} from "@lodestar/types";

const SLOT_BYTE_COUNT = 8;
const SLOT_BYTES_POSITION_IN_STATE = 40;

describe("state test", function () {
  const folder = "/Users/tuyennguyen/Downloads";
  // const folder = "/Users/tuyennguyen/Downloads/big_boy_0";
  const data = fs.readFileSync(path.join(folder, "mainnet_state.ssz"));
  // const data = fs.readFileSync(path.join(folder, "1.ssz"));
  console.log("@@@ number of bytes", data.length);
  let startTime = Date.now();
  const heapUsed= process.memoryUsage().heapUsed;
  const state = getStateTypeFromBytes(defaultChainConfig, data).deserializeToViewDU(data);
  console.log(
    "@@@ loaded state slot",
    state.slot,
    "in",
    Date.now() - startTime,
    "ms",
    "heapUse",
    bytesToSize(process.memoryUsage().heapUsed - heapUsed)
  );
  startTime = Date.now();
  state.hashTreeRoot();
  console.log("@@@ hashTreeRoot in", Date.now() - startTime, "ms");

  itBench({
    id: "deserialize state",
    fn: () => {
      getStateTypeFromBytes(defaultChainConfig, data).deserializeToViewDU(data);
    },
  });
});

function getStateTypeFromBytes(
  config: ChainForkConfig,
  bytes: Buffer | Uint8Array
): allForks.AllForksSSZTypes["BeaconState"] {
  const slot = bytesToInt(bytes.subarray(SLOT_BYTES_POSITION_IN_STATE, SLOT_BYTES_POSITION_IN_STATE + SLOT_BYTE_COUNT));
  return config.getForkTypes(slot).BeaconState;
}

function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(2);
  return `${size} ${sizes[i]}`;
}
