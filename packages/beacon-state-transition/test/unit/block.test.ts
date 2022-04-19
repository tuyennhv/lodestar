import * as fs from "fs";
import {CoordType, PublicKey, Signature} from "@chainsafe/bls";
import {createIBeaconConfig} from "@chainsafe/lodestar-config";
import {networksChainConfig} from "@chainsafe/lodestar-config/networks";
import {DOMAIN_SYNC_COMMITTEE} from "@chainsafe/lodestar-params";
import {altair, ssz} from "@chainsafe/lodestar-types";
import {BitArray, toHexString} from "@chainsafe/ssz";
import {expect} from "chai";

describe("SignedBeaconBlock", function () {
  this.timeout(0);

  it("Inspect block 2785280", () => {
    const signedBlock = jsonPathToBeaconBlock("/Users/tuyennguyen/Downloads/block_2785280.ssz");
    console.log("@@@ signedBlock slot", signedBlock.message.slot);
  });

  it.only("Reproduce lightclient sync issue #3933, state 2785280", () => {
    const signedBlock = jsonPathToBeaconBlock("/Users/tuyennguyen/Downloads/block_2785280.ssz");
    const {slot, body} = signedBlock.message;
    const {syncAggregate} = body;
    expect(slot).to.be.equal(2785280);
    const state = jsonPathToBeaconState("/Users/tuyennguyen/Downloads/state_2785280.ssz");
    expect(state.slot).to.be.equal(2785280);
    const committeePubkeys = state.currentSyncCommittee.pubkeys.map((data) =>
      PublicKey.fromBytes(data, CoordType.jacobian)
    );
    console.log(
      "@@@ state.currentSyncCommittee root",
      toHexString(ssz.altair.SyncCommittee.hashTreeRoot(state.currentSyncCommittee))
    );
    const participantPubkeys = getParticipantPubkeys(committeePubkeys, syncAggregate.syncCommitteeBits);
    const config = createIBeaconConfig(networksChainConfig["prater"], state.genesisValidatorsRoot);
    const signedHeaderRoot = signedBlock.message.parentRoot;
    // 2785278
    const signedHeaderSlot = slot - 2;

    const signingRoot = ssz.phase0.SigningData.hashTreeRoot({
      objectRoot: signedHeaderRoot,
      domain: config.getDomain(DOMAIN_SYNC_COMMITTEE, signedHeaderSlot),
    });

    console.log(
      "@@@ num participants",
      participantPubkeys.length,
      "syncAggregate.syncCommitteeSignature",
      toHexString(syncAggregate.syncCommitteeSignature),
      "signingRoot",
      toHexString(signingRoot)
    );

    expect(
      isValidBlsAggregate(participantPubkeys, signingRoot, syncAggregate.syncCommitteeSignature),
      "Wrong syncAggregate"
    ).to.be.true;

  });
});

const jsonPathToBeaconBlock = (path: string): altair.SignedBeaconBlock => {
  const signedBlockBytes = fs.readFileSync(path);
  const str = signedBlockBytes.toString();
  const json = JSON.parse(str);
  return ssz.altair.SignedBeaconBlock.fromJson(json["data"]);
};

const jsonPathToBeaconState = (path: string): altair.BeaconState => {
  const bytes = fs.readFileSync(path);
  const str = bytes.toString();
  const json = JSON.parse(str);
  return ssz.altair.BeaconState.fromJson(json["data"]);
};

const sszPathToBeaconState = (path: string): altair.BeaconState => {
  const stateBytes = fs.readFileSync(path);
  console.log("@@@ stateBytes.byteLength", stateBytes.byteLength, stateBytes.length);
  return ssz.altair.BeaconState.value_deserializeFromBytes(
    {uint8Array: stateBytes, dataView: new DataView(stateBytes.buffer, stateBytes.byteOffset, stateBytes.byteLength)},
    0,
    stateBytes.length
  );
};

export function getParticipantPubkeys<T>(pubkeys: T[], bits: BitArray): T[] {
  // BitArray.intersectValues() checks the length is correct
  return bits.intersectValues(pubkeys);
}

function isValidBlsAggregate(publicKeys: PublicKey[], message: Uint8Array, signature: Uint8Array): boolean {
  let aggPubkey: PublicKey;
  try {
    aggPubkey = PublicKey.aggregate(publicKeys);
  } catch (e) {
    (e as Error).message = `Error aggregating pubkeys: ${(e as Error).message}`;
    throw e;
  }

  let sig: Signature;
  try {
    sig = Signature.fromBytes(signature, undefined, true);
  } catch (e) {
    (e as Error).message = `Error deserializing signature: ${(e as Error).message}`;
    throw e;
  }

  try {
    return sig.verify(aggPubkey, message);
  } catch (e) {
    (e as Error).message = `Error verifying signature: ${(e as Error).message}`;
    throw e;
  }
}
