import { altair, ssz } from "@chainsafe/lodestar-types";
import * as fs from "fs";


describe("SignedBeaconBlock", () => {
  it.only("Inspect block 2785280", () => {
    const signedBlock = jsonPathToBeaconBlock("/Users/tuyennguyen/Downloads/block_2785280.ssz");
    console.log("@@@ signedBlock slot", signedBlock.message.slot);
  });
});

const jsonPathToBeaconBlock = (path: string): altair.SignedBeaconBlock => {
  const signedBlockBytes = fs.readFileSync(path);
  const str = signedBlockBytes.toString();
  const json = JSON.parse(str);
  return ssz.altair.SignedBeaconBlock.fromJson(json["data"]);
};
