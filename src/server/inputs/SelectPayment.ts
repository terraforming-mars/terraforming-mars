import {Message} from '../../common/logs/Message';
import {BasePlayerInput, PlayerInput} from '../PlayerInput';
import {PlayerInputType} from '../../common/input/PlayerInputType';
import {isPayment, Payment} from '../../common/inputs/Payment';
import {InputResponse, isSelectPaymentResponse} from '../../common/inputs/InputResponse';
import {Player} from '../Player';
import {PlayerInputModel} from '../../common/models/PlayerInputModel';

export class SelectPayment extends BasePlayerInput {
  constructor(
    title: string | Message,
    public canUseSteel: boolean,
    public canUseTitanium: boolean,
    public canUseHeat: boolean,
    public canUseSeeds: boolean,
    public canUseData: boolean,
    public canUseLunaTradeFederationTitanium: boolean,
    public amount: number,
    public cb: (payment: Payment) => PlayerInput | undefined,
  ) {
    super(PlayerInputType.SELECT_PAYMENT, title);
    this.buttonLabel = 'Pay'; // no input button
  }

  public override toModel(model: PlayerInputModel, player: Player) {
    model.amount = this.amount;
    model.canUseSteel = this.canUseSteel;
    model.canUseTitanium = this.canUseTitanium;
    model.canUseHeat = this.canUseHeat;
    model.canUseLunaTradeFederationTitanium = this.canUseLunaTradeFederationTitanium;
    model.canUseSeeds = this.canUseSeeds;
    model.seeds = player.getSpendableSeedResources();
    model.canUseData = this.canUseData;
    model.data = player.getSpendableData();
  }

  public process(input: InputResponse, player: Player) {
    if (!isSelectPaymentResponse(input)) {
      throw new Error('Not a valid SelectPaymentResponse');
    }
    if (!isPayment(input.payment)) {
      throw new Error('payment is not a valid type');
    }
    // TODO(kberg): This is called here and in SelectPaymentDeferred.
    // There's no reason for both.
    if (!player.canSpend(input.payment)) {
      throw new Error('You do not have that many resources');
    }
    return this.cb(input.payment);
  }
}
