import {ProposerSlashing, ValidatorIndex} from "@chainsafe/lodestar-types";
import {IBeaconConfig} from "@chainsafe/lodestar-config";

import {IDatabaseController} from "../../../controller";
import {Bucket} from "../../schema";
import {Repository} from "./abstract";

export class ProposerSlashingRepository extends Repository<ValidatorIndex, ProposerSlashing> {
  public constructor(
    config: IBeaconConfig,
    db: IDatabaseController<Buffer, Buffer>,
  ) {
    super(config, db, Bucket.proposerSlashing, config.types.ProposerSlashing);
  }

  public getId(value: ProposerSlashing): ValidatorIndex {
    return value.signedHeader1.message.proposerIndex;
  }
}
