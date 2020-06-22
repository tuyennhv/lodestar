import {Options} from "yargs";

import {canonicalOptions} from "../../../../util";
import {IBeaconArgs} from "../../options";

export interface IBeaconInitArgs extends IBeaconArgs {
  templateConfigFile?: string;
}

const templateConfig: Options = {
  alias: ["templateConfigFile", "templateConfig"],
  description: "Template configuration used to initialize beacon node",
  type: "string",
  default: null,
};

export const discv5BootEnrs: Options = {
  alias: [
    "network.discv5.bootEnrs",
  ],
  type: "array",
  default: [],
  group: "network",
};

export const networkBootnodes: Options = {
  alias: [
    "network.bootnodes",
  ],
  type: "array",
  default: [],
  group: "network",
};

export const beaconInitOptions = canonicalOptions({templateConfig, discv5BootEnrs, networkBootnodes});
