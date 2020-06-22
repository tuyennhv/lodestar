/* eslint-disable @typescript-eslint/interface-name-prefix */
import {Slot, Root} from "@chainsafe/lodestar-types";
import {Node} from "./lmdGhost";
import {RootHex, HexCheckpoint} from "../interface";

/**
 * Interface to initialize a Node.
 */
export interface NodeInfo {
  slot: Slot;
  blockRoot: RootHex;
  parent: Node;
  justifiedCheckpoint: HexCheckpoint;
  finalizedCheckpoint: HexCheckpoint;
  stateRoot: Root;
}
