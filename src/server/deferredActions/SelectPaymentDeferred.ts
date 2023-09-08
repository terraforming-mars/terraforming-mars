import {IPlayer} from '../IPlayer';
import {SelectPayment} from '../inputs/SelectPayment';
import {Payment} from '../../common/inputs/Payment';
import {DeferredAction, Priority} from './DeferredAction';
import {CardName} from '../../common/cards/CardName';
import {Message} from '../../common/logs/Message';

export type Options = {
  canUseSteel?: boolean;
  canUseTitanium?: boolean;
  canUseSeeds?: boolean,
  canUseData?: boolean,
  canUseGraphene?: boolean;
  title?: string | Message;
  afterPay?: () => void;
}

export class SelectPaymentDeferred extends DeferredAction {
  constructor(
    player: IPlayer,
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
    if (this.options.canUseGraphene && this.player.resourcesOnCard(CardName.CARBON_NANOSYSTEMS) > 0) {
      return false;
    }
    // HOOK: Luna Trade Federation
    if (this.player.isCorporation(CardName.LUNA_TRADE_FEDERATION) && this.player.titanium > 0) {
      return false;
    }
    if (this.options.canUseSeeds && (this.player.resourcesOnCard(CardName.SOYLENT_SEEDLING_SYSTEMS) > 0)) {
      return false;
    }
    if (this.options.canUseData && (this.player.resourcesOnCard(CardName.AURORAI) > 0)) {
      return false;
    }

    return true;
  }

  public execute() {
    if (this.mustPayWithMegacredits()) {
      if (this.player.megaCredits < this.amount) {
        throw new Error(`Player does not have ${this.amount} M€`);
      }
      this.player.pay(Payment.of({megaCredits: this.amount}));
      this.options.afterPay?.();
      return undefined;
    }

    return new SelectPayment(
      this.options.title || 'Select how to spend ' + this.amount + ' M€',
      this.amount,
      {
        steel: this.options.canUseSteel || false,
        titanium: this.options.canUseTitanium || false,
        heat: this.player.canUseHeatAsMegaCredits,
        seeds: this.options.canUseSeeds || false,
        data: this.options.canUseData || false,
        lunaTradeFederationTitanium: this.player.canUseTitaniumAsMegacredits,
      },
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
          auroraiData: this.options.canUseData,
        });
        if (amountPaid < this.amount) {
          throw new Error('Did not spend enough');
        }
        this.player.pay(payment);
        this.options.afterPay?.();
        return undefined;
      },
    );
  }
}
