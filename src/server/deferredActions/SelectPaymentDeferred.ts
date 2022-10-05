import {Player} from '../Player';
import {SelectPayment} from '../inputs/SelectPayment';
import {Payment} from '../../common/inputs/Payment';
import {DeferredAction, Priority} from './DeferredAction';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';

export type Options = {
  canUseSteel?: boolean;
  canUseTitanium?: boolean;
  canUseSeeds?: boolean,
  canUseData?: boolean,
  title?: string;
  afterPay?: () => void;
}

export class SelectPaymentDeferred extends DeferredAction {
  constructor(
    player: Player,
    public amount: number,
    public options: Options = {},
  ) {
    super(player, Priority.DEFAULT);
  }

  private mustPayWithMegacredits() {
    if (this.player.canUseHeatAsMegaCredits && this.player.availableHeat() > 0) {
      return false;
    }
    if (this.options.canUseSteel && this.player.steel > 0) {
      return false;
    }
    if (this.options.canUseTitanium && this.player.titanium > 0) {
      return false;
    }
    // HOOK: Luna Trade Federation
    if (this.player.isCorporation(CardName.LUNA_TRADE_FEDERATION) && this.player.titanium > 0) {
      return false;
    }
    if (this.options.canUseSeeds && (this.player.getCorporation(CardName.SOYLENT_SEEDLING_SYSTEMS)?.resourceCount ?? 0) > 0) {
      return false;
    }
    if (this.options.canUseData && (this.player.getCorporation(CardName.AURORAI)?.resourceCount ?? 0) > 0) {
      return false;
    }

    return true;
  }

  public execute() {
    if (this.mustPayWithMegacredits()) {
      if (this.player.megaCredits < this.amount) {
        throw new Error(`Player does not have ${this.amount} M€`);
      }
      this.player.deductResource(Resources.MEGACREDITS, this.amount);
      this.options.afterPay?.();
      return undefined;
    }

    return new SelectPayment(
      this.options.title || 'Select how to spend ' + this.amount + ' M€',
      this.options.canUseSteel || false,
      this.options.canUseTitanium || false,
      this.player.canUseHeatAsMegaCredits,
      this.options.canUseSeeds || false,
      this.options.canUseData || false,
      this.player.canUseTitaniumAsMegacredits,
      this.amount,
      (payment: Payment) => {
        if (!this.player.canSpend(payment)) {
          throw new Error('You do not have that many resources to spend');
        }
        const amountPaid = this.player.payingAmount(payment, {
          steel: this.options.canUseSteel,
          titanium: this.options.canUseTitanium,
          seeds: this.options.canUseSeeds,
          floaters: false, // Used in project cards only
          microbes: false, // Used in project cards only
          science: false, // Used in project cards only
          data: this.options.canUseData,
        });
        if (amountPaid < this.amount) {
          throw new Error('Did not spend enough to pay for standard project');
        }
        this.player.pay(payment);
        this.options.afterPay?.();
        return undefined;
      },
    );
  }
}
