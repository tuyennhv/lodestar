import {config} from "@chainsafe/lodestar-config/lib/presets/minimal";
import sinon, {SinonStubbedInstance} from "sinon";
import {expect} from "chai";
import {BeaconApi, IBeaconApi} from "../../../../../src/api/impl/beacon";
import {BeaconChain, IBeaconChain} from "../../../../../src/chain";
import {generateState} from "../../../../utils/state";
import {generateValidator} from "../../../../utils/validator";
import {EpochContext} from "@chainsafe/lodestar-beacon-state-transition";


describe("get validator details api", function () {

  const sandbox = sinon.createSandbox();

  let chainStub: SinonStubbedInstance<IBeaconChain>;

  let api: IBeaconApi;

  beforeEach(function () {
    chainStub = sinon.createStubInstance(BeaconChain);
    // @ts-ignore
    api = new BeaconApi({}, {chain: chainStub, config});
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("should get validator details", async function () {
    const epochCtx = new EpochContext(config);
    chainStub.getEpochContext.returns(epochCtx);
    epochCtx.pubkey2index.set(Buffer.alloc(48, 2), 1);
    chainStub.getHeadState.resolves(
      generateState({
        validators: [
          generateValidator({
            pubkey: Buffer.alloc(48, 1)
          }),
          generateValidator({
            pubkey: Buffer.alloc(48, 2),
            slashed: true
          })
        ]
      })
    );
    const result = await api.getValidator(Buffer.alloc(48, 2));
    expect(result.validator.slashed).to.be.true;
    expect(result.index).to.be.equal(1);
  });

  it("validators not found", async function () {
    chainStub.getEpochContext.returns(new EpochContext(config));
    chainStub.getHeadState.resolves(
      generateState({
        validators: [
          generateValidator({
            pubkey: Buffer.alloc(48, 1),
            slashed: true
          }),
          generateValidator({
            pubkey: Buffer.alloc(48, 2)
          })
        ]
      })
    );
    const result = await api.getValidator(Buffer.alloc(48, 3));
    expect(result).to.be.null;
  });

});