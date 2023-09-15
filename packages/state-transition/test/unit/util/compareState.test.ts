import {ssz} from "@lodestar/types";
import {expect} from "chai";
import fs from "fs";
import path from "path";

describe("compareState", function () {
  this.timeout(0);
  const stateType = ssz.capella.BeaconState;

  const folder = "/Users/tuyennguyen/tuyen/state_migration";
  const data = Uint8Array.from(fs.readFileSync(path.join(folder, "mainnet_state_6543072.ssz")));
  const data2 = Uint8Array.from(fs.readFileSync(path.join(folder, "mainnet_state_Sep_15.ssz")));
  const state = stateType.deserializeToViewDU(data);
  const state2 = stateType.deserializeToViewDU(data2);
  const validatorCount = state.validators.length;
  const validatorCount2 = state2.validators.length;
  const minValidator = Math.min(validatorCount, validatorCount2);
  const slotDiff = state.slot - state2.slot;
  const slotSecDiff = 12 * slotDiff;
  const hourDiff = Math.floor(slotSecDiff / 3600);
  const dayDiff = Math.floor(hourDiff / 24);
  console.log("slotDiff", slotDiff, "dayDiff", dayDiff);

  it.only("compare inactivity scores of validators up to " + minValidator, () => {
    const inactivityScores = state.inactivityScores;
    const inactivityScores2 = state2.inactivityScores;
    let diff = 0;
    let count0 = 0;
    for (let i = 0; i < minValidator; i++) {
      const activityScore = inactivityScores.get(i);
      const activityScore2 = inactivityScores2.get(i);
      if (activityScore !== activityScore2) {
        diff++;
      }
      if (activityScore === 0) {
        count0++;
      }
    }
    console.log("diff", diff, "count0", count0, "minValidator", minValidator);
    // expect 5% diff
    expect(diff / minValidator).to.be.lessThan(0.05);
  });
});
