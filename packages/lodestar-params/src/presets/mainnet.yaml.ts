// Mainnet preset
// Note: the intention of this file (for now) is to illustrate what a mainnet configuration could look like.
// Some of these constants may still change before the launch of Phase 0.

export const mainnetYaml = {
  // Misc
  // ---------------------------------------------------------------
  // 2**6 (= 64)
  MAX_COMMITTEES_PER_SLOT: 64,
  // 2**7 (= 128)
  TARGET_COMMITTEE_SIZE: 128,
  // 2**11 (= 2,048)
  MAX_VALIDATORS_PER_COMMITTEE: 2048,
  // 2**2 (= 4)
  MIN_PER_EPOCH_CHURN_LIMIT: 4,
  // 2**16 (= 65,536)
  CHURN_LIMIT_QUOTIENT: 65536,
  // See issue 563
  SHUFFLE_ROUND_COUNT: 90,
  // `2**14` (= 16,384)
  MIN_GENESIS_ACTIVE_VALIDATOR_COUNT: 16384,
  // Jan 3, 2020
  MIN_GENESIS_TIME: 1578009600,
  // 4
  HYSTERESIS_QUOTIENT: 4,
  // 1 (minus 0.25)
  HYSTERESIS_DOWNWARD_MULTIPLIER: 1,
  // 5 (plus 1.25)
  HYSTERESIS_UPWARD_MULTIPLIER: 5,
  // 3
  PROPORTIONAL_SLASHING_MULTIPLIER: 3,

  // Fork Choice
  // ---------------------------------------------------------------
  // 2**3 (= 8)
  SAFE_SLOTS_TO_UPDATE_JUSTIFIED: 8,

  // Validator
  // ---------------------------------------------------------------
  // 2**10 (= 1,024)
  ETH1_FOLLOW_DISTANCE: 1024,
  // 2**4 (= 16)
  TARGET_AGGREGATORS_PER_COMMITTEE: 16,
  // 2**0 (= 1)
  RANDOM_SUBNETS_PER_VALIDATOR: 1,
  // 2**8 (= 256)
  EPOCHS_PER_RANDOM_SUBNET_SUBSCRIPTION: 256,
  // 14 (estimate from Eth1 mainnet)
  SECONDS_PER_ETH1_BLOCK: 14,

  // Deposit contract
  // ---------------------------------------------------------------
  // Ethereum PoW Mainnet
  DEPOSIT_CHAIN_ID: 1,
  DEPOSIT_NETWORK_ID: 1,
  // **TBD**
  DEPOSIT_CONTRACT_ADDRESS: "0x1234567890123456789012345678901234567890",

  // Gwei values
  // ---------------------------------------------------------------
  // 2**0 * 10**9 (= 1,000,000,000) Gwei
  MIN_DEPOSIT_AMOUNT: 1000000000,
  // 2**5 * 10**9 (= 32,000,000,000) Gwei
  MAX_EFFECTIVE_BALANCE: 32000000000,
  // 2**4 * 10**9 (= 16,000,000,000) Gwei
  EJECTION_BALANCE: 16000000000,
  // 2**0 * 10**9 (= 1,000,000,000) Gwei
  EFFECTIVE_BALANCE_INCREMENT: 1000000000,

  // Initial values
  // ---------------------------------------------------------------
  // Mainnet initial fork version, recommend altering for testnets
  GENESIS_FORK_VERSION: "0x00000000",
  BLS_WITHDRAWAL_PREFIX: "0x00",

  // Time parameters
  // ---------------------------------------------------------------
  // 172800 seconds (2 days)
  GENESIS_DELAY: 172800,
  // 12 seconds
  SECONDS_PER_SLOT: 12,
  // 2**0 (= 1) slots 12 seconds
  MIN_ATTESTATION_INCLUSION_DELAY: 1,
  // 2**5 (= 32) slots 6.4 minutes
  SLOTS_PER_EPOCH: 32,
  // 2**0 (= 1) epochs 6.4 minutes
  MIN_SEED_LOOKAHEAD: 1,
  // 2**2 (= 4) epochs 25.6 minutes
  MAX_SEED_LOOKAHEAD: 4,
  // 2**5 (= 32) epochs ~3.4 hours
  EPOCHS_PER_ETH1_VOTING_PERIOD: 32,
  // 2**13 (= 8,192) slots ~13 hours
  SLOTS_PER_HISTORICAL_ROOT: 8192,
  // 2**8 (= 256) epochs ~27 hours
  MIN_VALIDATOR_WITHDRAWABILITY_DELAY: 256,
  // 2**8 (= 256) epochs ~27 hours
  SHARD_COMMITTEE_PERIOD: 256,
  // 2**6 (= 64) epochs ~7 hours
  MAX_EPOCHS_PER_CROSSLINK: 64,
  // 2**2 (= 4) epochs 25.6 minutes
  MIN_EPOCHS_TO_INACTIVITY_PENALTY: 4,

  // State vector lengths
  // ---------------------------------------------------------------
  // 2**16 (= 65,536) epochs ~0.8 years
  EPOCHS_PER_HISTORICAL_VECTOR: 65536,
  // 2**13 (= 8,192) epochs ~36 days
  EPOCHS_PER_SLASHINGS_VECTOR: 8192,
  // 2**24 (= 16,777,216) historical roots, ~26,131 years
  HISTORICAL_ROOTS_LIMIT: 16777216,
  // 2**40 (= 1,099,511,627,776) validator spots
  VALIDATOR_REGISTRY_LIMIT: 1099511627776,

  // Reward and penalty quotients
  // ---------------------------------------------------------------
  // 2**6 (= 64)
  BASE_REWARD_FACTOR: 64,
  // 2**9 (= 512)
  WHISTLEBLOWER_REWARD_QUOTIENT: 512,
  // 2**3 (= 8)
  PROPOSER_REWARD_QUOTIENT: 8,
  // 2**24 (= 16,777,216)
  INACTIVITY_PENALTY_QUOTIENT: 16777216,
  // 2**5 (= 32)
  MIN_SLASHING_PENALTY_QUOTIENT: 32,

  // Max operations per block
  // ---------------------------------------------------------------
  // 2**4 (= 16)
  MAX_PROPOSER_SLASHINGS: 16,
  // 2**1 (= 2)
  MAX_ATTESTER_SLASHINGS: 2,
  // 2**7 (= 128)
  MAX_ATTESTATIONS: 128,
  // 2**4 (= 16)
  MAX_DEPOSITS: 16,
  // 2**4 (= 16)
  MAX_VOLUNTARY_EXITS: 16,

  // Signature domains
  // ---------------------------------------------------------------
  DOMAIN_BEACON_PROPOSER: "0x00000000",
  DOMAIN_BEACON_ATTESTER: "0x01000000",
  DOMAIN_RANDAO: "0x02000000",
  DOMAIN_DEPOSIT: "0x03000000",
  DOMAIN_VOLUNTARY_EXIT: "0x04000000",
  DOMAIN_SELECTION_PROOF: "0x05000000",
  DOMAIN_AGGREGATE_AND_PROOF: "0x06000000",
};
