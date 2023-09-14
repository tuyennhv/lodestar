import {itBench, setBenchOpts} from "@dapplion/benchmark";
import {byteArrayEquals, fromHexString} from "@chainsafe/ssz";
import {ssz} from "@lodestar/types";
import crypto from "node:crypto";

// As of Jun 17 2021
// Compare state root
// ================================================================
// ssz.Root.equals                                                        891265.6 ops/s      1.122000 us/op 10017946 runs    15.66 s
// ssz.Root.equals with valueOf()                                         692041.5 ops/s      1.445000 us/op 8179741 runs    15.28 s
// byteArrayEquals with valueOf()                                         853971.0 ops/s      1.171000 us/op 9963051 runs    16.07 s

describe("root equals", () => {
  setBenchOpts({
    noThreshold: true,
    minMs: 10_000,
  });

  const stateRoot = fromHexString("0x6c86ca3c4c6688cf189421b8a68bf2dbc91521609965e6f4e207d44347061fee");
  const rootTree = ssz.Root.toViewDU(stateRoot);

  const runFactor = 1000;
  // This benchmark is very unstable in CI. We already know that "ssz.Root.equals" is the fastest
  itBench({
    id: "ssz.Root.equals",
    fn: () => {
      for (let i = 0; i < runFactor; i++) ssz.Root.equals(rootTree, stateRoot);
    },
    runsFactor: runFactor,
  });
  // itBench("ssz.Root.equals", () => {
  //   ssz.Root.equals(rootTree, stateRoot);
  // });

  itBench({
    id: "byteArrayEquals",
    fn: () => {
      for (let i = 0; i < runFactor; i++) byteArrayEquals(rootTree, stateRoot);
    },
    runsFactor: runFactor,
  });

  const bytes = crypto.randomBytes(100_000_000);
  const bytes2 = bytes.slice();

  itBench({
    id: "byteArrayEquals 100_000_000",
    fn: () => {
      byteArrayEquals(bytes, bytes2);
    },
  });

  // itBench("byteArrayEquals", () => {
  //   byteArrayEquals(rootTree, stateRoot);
  // });

  itBench({
    id: "Buffer.compare",
    fn: () => {
      Buffer.compare(rootTree, stateRoot);
    },
  });

  itBench({
    id: "Buffer.compare 100_000_000",
    fn: () => {
      for (let i = 0; i < runFactor; i++) Buffer.compare(bytes, bytes2);
    },
    runsFactor: runFactor,
  });

  // itBench("Buffer.compare", () => {
  //   Buffer.compare(rootTree, stateRoot);
  // });
});
