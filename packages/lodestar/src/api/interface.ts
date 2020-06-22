/**
 * @module api
 */
import {IBeaconConfig} from "@chainsafe/lodestar-config";
import {IBeaconChain} from "../chain";
import {IBeaconDb} from "../db/api";
import {IApiOptions} from "./options";
import {ApiNamespace} from "./index";
import {ILogger} from "@chainsafe/lodestar-utils/lib/logger";
import {IBeaconSync} from "../sync";
import {INetwork} from "../network";

export interface IApiModules {
  config: IBeaconConfig;
  logger: ILogger;
  chain: IBeaconChain;
  sync: IBeaconSync;
  network: INetwork;
  db: IBeaconDb;
}

export interface IApiConstructor {

  new(opts: Partial<IApiOptions>, modules: IApiModules): IApi;

}

export interface IApi {

  /**
     * Name space for API commands
     */
  namespace: ApiNamespace;

}
