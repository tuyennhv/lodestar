import {CompositeViewDU} from "@chainsafe/ssz";
import {ssz} from "@lodestar/types";

const stateType = ssz.capella.BeaconState;
const validatorBytesSize = 121;
export function migrateState(
  state: CompositeViewDU<typeof ssz.capella.BeaconState>,
  data: Uint8Array,
  modifiedValidators: number[] = []
): CompositeViewDU<typeof ssz.capella.BeaconState> {
  const dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const fieldRanges = stateType.getFieldRanges(dataView, 0, data.length);
  const clonedState = loadValidators(state, data, modifiedValidators);
  const allFields = Object.keys(stateType.fields);
  // genesisTime, could skip
  // genesisValidatorsRoot, could skip
  const slotIndex = allFields.indexOf("slot");
  const slotRange = fieldRanges[slotIndex];
  clonedState.slot = stateType.fields.slot.deserialize(data.subarray(slotRange.start, slotRange.end));
  // fork
  const forkIndex = allFields.indexOf("fork");
  const forkRange = fieldRanges[forkIndex];
  clonedState.fork = stateType.fields.fork.deserializeToViewDU(data.subarray(forkRange.start, forkRange.end));
  // latestBlockHeader
  const latestBlockHeaderIndex = allFields.indexOf("latestBlockHeader");
  const latestBlockHeaderRange = fieldRanges[latestBlockHeaderIndex];
  clonedState.latestBlockHeader = stateType.fields.latestBlockHeader.deserializeToViewDU(
    data.subarray(latestBlockHeaderRange.start, latestBlockHeaderRange.end)
  );
  // blockRoots
  const blockRootsIndex = allFields.indexOf("blockRoots");
  const blockRootsRange = fieldRanges[blockRootsIndex];
  clonedState.blockRoots = stateType.fields.blockRoots.deserializeToViewDU(
    data.subarray(blockRootsRange.start, blockRootsRange.end)
  );
  // stateRoots
  const stateRootsIndex = allFields.indexOf("stateRoots");
  const stateRootsRange = fieldRanges[stateRootsIndex];
  clonedState.stateRoots = stateType.fields.stateRoots.deserializeToViewDU(
    data.subarray(stateRootsRange.start, stateRootsRange.end)
  );
  // historicalRoots
  const historicalRootsIndex = allFields.indexOf("historicalRoots");
  const historicalRootsRange = fieldRanges[historicalRootsIndex];
  clonedState.historicalRoots = stateType.fields.historicalRoots.deserializeToViewDU(
    data.subarray(historicalRootsRange.start, historicalRootsRange.end)
  );
  // eth1Data
  const eth1DataIndex = allFields.indexOf("eth1Data");
  const eth1DataRange = fieldRanges[eth1DataIndex];
  clonedState.eth1Data = stateType.fields.eth1Data.deserializeToViewDU(
    data.subarray(eth1DataRange.start, eth1DataRange.end)
  );
  // eth1DataVotes
  const eth1DataVotesIndex = allFields.indexOf("eth1DataVotes");
  const eth1DataVotesRange = fieldRanges[eth1DataVotesIndex];
  clonedState.eth1DataVotes = stateType.fields.eth1DataVotes.deserializeToViewDU(
    data.subarray(eth1DataVotesRange.start, eth1DataVotesRange.end)
  );
  // eth1DepositIndex
  const eth1DepositIndexIndex = allFields.indexOf("eth1DepositIndex");
  const eth1DepositIndexRange = fieldRanges[eth1DepositIndexIndex];
  clonedState.eth1DepositIndex = stateType.fields.eth1DepositIndex.deserialize(
    data.subarray(eth1DepositIndexRange.start, eth1DepositIndexRange.end)
  );
  // validators is loaded above
  // balances
  const balancesIndex = allFields.indexOf("balances");
  const balancesRange = fieldRanges[balancesIndex];
  clonedState.balances = stateType.fields.balances.deserializeToViewDU(
    data.subarray(balancesRange.start, balancesRange.end)
  );
  // randaoMixes
  // TODO: this takes 200ms to do hashTreeRoot, should we only update individual field?
  const randaoMixesIndex = allFields.indexOf("randaoMixes");
  const randaoMixesRange = fieldRanges[randaoMixesIndex];
  clonedState.randaoMixes = stateType.fields.randaoMixes.deserializeToViewDU(
    data.subarray(randaoMixesRange.start, randaoMixesRange.end)
  );
  // slashings
  const slashingsIndex = allFields.indexOf("slashings");
  const slashingsRange = fieldRanges[slashingsIndex];
  clonedState.slashings = stateType.fields.slashings.deserializeToViewDU(
    data.subarray(slashingsRange.start, slashingsRange.end)
  );
  // previousEpochParticipation
  const previousEpochParticipationIndex = allFields.indexOf("previousEpochParticipation");
  const previousEpochParticipationRange = fieldRanges[previousEpochParticipationIndex];
  clonedState.previousEpochParticipation = stateType.fields.previousEpochParticipation.deserializeToViewDU(
    data.subarray(previousEpochParticipationRange.start, previousEpochParticipationRange.end)
  );
  // currentEpochParticipation
  const currentEpochParticipationIndex = allFields.indexOf("currentEpochParticipation");
  const currentEpochParticipationRange = fieldRanges[currentEpochParticipationIndex];
  clonedState.currentEpochParticipation = stateType.fields.currentEpochParticipation.deserializeToViewDU(
    data.subarray(currentEpochParticipationRange.start, currentEpochParticipationRange.end)
  );
  // justificationBits
  const justificationBitsIndex = allFields.indexOf("justificationBits");
  const justificationBitsRange = fieldRanges[justificationBitsIndex];
  clonedState.justificationBits = stateType.fields.justificationBits.deserializeToViewDU(
    data.subarray(justificationBitsRange.start, justificationBitsRange.end)
  );
  // previousJustifiedCheckpoint
  const previousJustifiedCheckpointIndex = allFields.indexOf("previousJustifiedCheckpoint");
  const previousJustifiedCheckpointRange = fieldRanges[previousJustifiedCheckpointIndex];
  clonedState.previousJustifiedCheckpoint = stateType.fields.previousJustifiedCheckpoint.deserializeToViewDU(
    data.subarray(previousJustifiedCheckpointRange.start, previousJustifiedCheckpointRange.end)
  );
  // currentJustifiedCheckpoint
  const currentJustifiedCheckpointIndex = allFields.indexOf("currentJustifiedCheckpoint");
  const currentJustifiedCheckpointRange = fieldRanges[currentJustifiedCheckpointIndex];
  clonedState.currentJustifiedCheckpoint = stateType.fields.currentJustifiedCheckpoint.deserializeToViewDU(
    data.subarray(currentJustifiedCheckpointRange.start, currentJustifiedCheckpointRange.end)
  );
  // finalizedCheckpoint
  const finalizedCheckpointIndex = allFields.indexOf("finalizedCheckpoint");
  const finalizedCheckpointRange = fieldRanges[finalizedCheckpointIndex];
  clonedState.finalizedCheckpoint = stateType.fields.finalizedCheckpoint.deserializeToViewDU(
    data.subarray(finalizedCheckpointRange.start, finalizedCheckpointRange.end)
  );
  // inactivityScores
  // TODO: this takes ~500 to hashTreeRoot, should we only update individual field?
  const inactivityScoresIndex = allFields.indexOf("inactivityScores");
  const inactivityScoresRange = fieldRanges[inactivityScoresIndex];
  // clonedState.inactivityScores = stateType.fields.inactivityScores.deserializeToViewDU(
  //   data.subarray(inactivityScoresRange.start, inactivityScoresRange.end)
  // );
  loadInactivityScores(clonedState, data.subarray(inactivityScoresRange.start, inactivityScoresRange.end));
  // TODO: 2 states could be in same sync committee, do a check before update
  // this takes ~200ms to hashTreeRoot
  // currentSyncCommittee
  const currentSyncCommitteeIndex = allFields.indexOf("currentSyncCommittee");
  const currentSyncCommitteeRange = fieldRanges[currentSyncCommitteeIndex];
  clonedState.currentSyncCommittee = stateType.fields.currentSyncCommittee.deserializeToViewDU(
    data.subarray(currentSyncCommitteeRange.start, currentSyncCommitteeRange.end)
  );
  // nextSyncCommittee
  const nextSyncCommitteeIndex = allFields.indexOf("nextSyncCommittee");
  const nextSyncCommitteeRange = fieldRanges[nextSyncCommitteeIndex];
  clonedState.nextSyncCommittee = stateType.fields.nextSyncCommittee.deserializeToViewDU(
    data.subarray(nextSyncCommitteeRange.start, nextSyncCommitteeRange.end)
  );
  // latestExecutionPayloadHeader
  const latestExecutionPayloadHeaderIndex = allFields.indexOf("latestExecutionPayloadHeader");
  const latestExecutionPayloadHeaderRange = fieldRanges[latestExecutionPayloadHeaderIndex];
  clonedState.latestExecutionPayloadHeader = stateType.fields.latestExecutionPayloadHeader.deserializeToViewDU(
    data.subarray(latestExecutionPayloadHeaderRange.start, latestExecutionPayloadHeaderRange.end)
  );
  // nextWithdrawalIndex
  const nextWithdrawalIndexIndex = allFields.indexOf("nextWithdrawalIndex");
  const nextWithdrawalIndexRange = fieldRanges[nextWithdrawalIndexIndex];
  clonedState.nextWithdrawalIndex = stateType.fields.nextWithdrawalIndex.deserialize(
    data.subarray(nextWithdrawalIndexRange.start, nextWithdrawalIndexRange.end)
  );
  // nextWithdrawalValidatorIndex
  const nextWithdrawalValidatorIndexIndex = allFields.indexOf("nextWithdrawalValidatorIndex");
  const nextWithdrawalValidatorIndexRange = fieldRanges[nextWithdrawalValidatorIndexIndex];
  clonedState.nextWithdrawalValidatorIndex = stateType.fields.nextWithdrawalValidatorIndex.deserialize(
    data.subarray(nextWithdrawalValidatorIndexRange.start, nextWithdrawalValidatorIndexRange.end)
  );
  // historicalSummaries
  const historicalSummariesIndex = allFields.indexOf("historicalSummaries");
  const historicalSummariesRange = fieldRanges[historicalSummariesIndex];
  clonedState.historicalSummaries = stateType.fields.historicalSummaries.deserializeToViewDU(
    data.subarray(historicalSummariesRange.start, historicalSummariesRange.end)
  );
  clonedState.commit();
  // TODO: do a for loop
  // for (const [fieldName, type] of Object.entries(stateType.fields)) {
  //   const field = fieldName as keyof typeof stateType.fields;
  //   if (field === "validators") {
  //     continue;
  //   }
  //   const fieldIndex = allFields.indexOf(field);
  //   const fieldRange = fieldRanges[fieldIndex];
  //   if (field === "slot") {
  //     clonedState[field] = type.deserialize(data.subarray(fieldRange.start, fieldRange.end));
  //   }
  //   if (type instanceof CompositeType) {
  //     clonedState[field] = type.deserializeToViewDU(data.subarray(fieldRange.start, fieldRange.end));
  //   } else if (type instanceof UintNumberType) {
  //     clonedState[fieldName] = type.deserialize(data.subarray(fieldRange.start, fieldRange.end));
  //   }
  // }

  return clonedState;
}

// state store inactivity scores of old seed state, we need to update it
function loadInactivityScores(
  state: CompositeViewDU<typeof ssz.capella.BeaconState>,
  inactivityScoresBytes: Uint8Array
): void {
  const oldValidator = state.inactivityScores.length;
  // UintNum64 = 8 bytes
  const newValidator = inactivityScoresBytes.length / 8;
  const minValidator = Math.min(oldValidator, newValidator);
  const oldInactivityScores = state.inactivityScores.serialize();
  const isMoreValidator = newValidator >= oldValidator;
  const modifiedValidators: number[] = [];
  findModifiedInactivityScores(
    isMoreValidator ? oldInactivityScores : oldInactivityScores.subarray(0, minValidator * 8),
    isMoreValidator ? inactivityScoresBytes.subarray(0, minValidator * 8) : inactivityScoresBytes,
    modifiedValidators
  );

  for (const validatorIndex of modifiedValidators) {
    state.inactivityScores.set(
      validatorIndex,
      ssz.UintNum64.deserialize(inactivityScoresBytes.subarray(validatorIndex * 8, (validatorIndex + 1) * 8))
    );
  }

  if (isMoreValidator) {
    // add new inactivityScores
    for (let validatorIndex = oldValidator; validatorIndex < newValidator; validatorIndex++) {
      state.inactivityScores.push(
        ssz.UintNum64.deserialize(inactivityScoresBytes.subarray(validatorIndex * 8, (validatorIndex + 1) * 8))
      );
    }
  } else {
    // TODO: implement this in ssz?
    // state.inactivityScores = state.inactivityScores.sliceTo(newValidator - 1);
  }
}

function loadValidators(
  seedState: CompositeViewDU<typeof ssz.capella.BeaconState>,
  data: Uint8Array,
  modifiedValidators: number[] = []
): CompositeViewDU<typeof ssz.capella.BeaconState> {
  const dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const fieldRanges = stateType.getFieldRanges(dataView, 0, data.length);
  const validatorsFieldIndex = Object.keys(stateType.fields).indexOf("validators");
  const validatorsRange = fieldRanges[validatorsFieldIndex];
  const oldValidatorCount = seedState.validators.length;
  const newValidatorCount = (validatorsRange.end - validatorsRange.start) / validatorBytesSize;
  const isMoreValidator = newValidatorCount >= oldValidatorCount;
  const minValidatorCount = Math.min(oldValidatorCount, newValidatorCount);
  // new state now have same validators to seed state
  const newState = seedState.clone();
  const validatorsBytes = seedState.validators.serialize();
  const validatorsBytes2 = data.slice(validatorsRange.start, validatorsRange.end);
  findModifiedValidators(
    isMoreValidator ? validatorsBytes : validatorsBytes.subarray(0, minValidatorCount * validatorBytesSize),
    isMoreValidator ? validatorsBytes2.subarray(0, minValidatorCount * validatorBytesSize) : validatorsBytes2,
    modifiedValidators
  );
  for (const i of modifiedValidators) {
    newState.validators.set(
      i,
      ssz.phase0.Validator.deserializeToViewDU(
        validatorsBytes2.subarray(i * validatorBytesSize, (i + 1) * validatorBytesSize)
      )
    );
  }

  if (newValidatorCount >= oldValidatorCount) {
    // add new validators
    for (let validatorIndex = oldValidatorCount; validatorIndex < newValidatorCount; validatorIndex++) {
      newState.validators.push(
        ssz.phase0.Validator.deserializeToViewDU(
          validatorsBytes2.subarray(validatorIndex * validatorBytesSize, (validatorIndex + 1) * validatorBytesSize)
        )
      );
      modifiedValidators.push(validatorIndex);
    }
  } else {
    newState.validators = newState.validators.sliceTo(newValidatorCount - 1);
  }
  newState.commit();
  return newState;
}

function findModifiedValidators(
  validatorsBytes: Uint8Array,
  validatorsBytes2: Uint8Array,
  modifiedValidators: number[],
  validatorOffset = 0
): void {
  if (validatorsBytes.length !== validatorsBytes2.length) {
    throw new Error(
      "validatorsBytes.length !== validatorsBytes2.length " + validatorsBytes.length + " vs " + validatorsBytes2.length
    );
  }

  if (Buffer.compare(validatorsBytes, validatorsBytes2) === 0) {
    return;
  }

  if (validatorsBytes.length === validatorBytesSize) {
    modifiedValidators.push(validatorOffset);
    return;
  }

  const numValidator = Math.floor(validatorsBytes.length / validatorBytesSize);
  const halfValidator = Math.floor(numValidator / 2);
  findModifiedValidators(
    validatorsBytes.subarray(0, halfValidator * validatorBytesSize),
    validatorsBytes2.subarray(0, halfValidator * validatorBytesSize),
    modifiedValidators,
    validatorOffset
  );
  findModifiedValidators(
    validatorsBytes.subarray(halfValidator * validatorBytesSize),
    validatorsBytes2.subarray(halfValidator * validatorBytesSize),
    modifiedValidators,
    validatorOffset + halfValidator
  );
}

// as monitored on mainnet, inactivityScores are not changed much and they are mostly 0
function findModifiedInactivityScores(
  inactivityScoresBytes: Uint8Array,
  inactivityScoresBytes2: Uint8Array,
  modifiedValidators: number[],
  validatorOffset = 0
): void {
  if (inactivityScoresBytes.length !== inactivityScoresBytes2.length) {
    throw new Error(
      "inactivityScoresBytes.length !== inactivityScoresBytes2.length " +
        inactivityScoresBytes.length +
        " vs " +
        inactivityScoresBytes2.length
    );
  }

  if (Buffer.compare(inactivityScoresBytes, inactivityScoresBytes2) === 0) {
    return;
  }

  // UintNum64 = 8 bytes
  if (inactivityScoresBytes.length === 8) {
    modifiedValidators.push(validatorOffset);
    return;
  }

  const numValidator = Math.floor(inactivityScoresBytes.length / 8);
  const halfValidator = Math.floor(numValidator / 2);
  findModifiedInactivityScores(
    inactivityScoresBytes.subarray(0, halfValidator * 8),
    inactivityScoresBytes2.subarray(0, halfValidator * 8),
    modifiedValidators,
    validatorOffset
  );
  findModifiedInactivityScores(
    inactivityScoresBytes.subarray(halfValidator * 8),
    inactivityScoresBytes2.subarray(halfValidator * 8),
    modifiedValidators,
    validatorOffset + halfValidator
  );
}
