import {Argv} from "yargs";

import {IGlobalArgs} from "../../options";

import * as wallet from "./cmds/wallet";
import * as validator from "./cmds/validator";

export const command = ["account <command>", "am", "a"];

export const description = "Utilities for generating and managing Ethereum 2.0 accounts";

export function builder(yargs: Argv<IGlobalArgs>): Argv {
  return yargs
    .command(validator)
    .command(wallet);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function handler(): void {
}

