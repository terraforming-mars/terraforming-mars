import {Player} from '../Player';
import {SelectHowToPay} from '../inputs/SelectHowToPay';
import {HowToPay} from '../inputs/HowToPay';
import {DeferredAction, Priority} from './DeferredAction';
import {Resources} from '../Resources';

export class SelectHowToPayDeferred implements DeferredAction {
  public priority = Priority.DEFAULT;
  constructor(
        public player: Player,
        public amount: number,
        public options: SelectHowToPayDeferred.Options = {},
  ) {}

  private mustPayWithMegacredits() {
    if (this.player.canUseHeatAsMegaCredits && this.player.heat > 0) {
      return false;
    }
    if (this.options.canUseSteel && this.player.steel > 0) {
      return false;
    }
    if (this.options.canUseTitanium && this.player.titanium > 0) {
      return false;
    }
    if (this.options.canUseSeeds && (this.player.corporationCard?.resourceCount ?? 0 > 0)) {
      return false;
    }
    return true;
  }

  public execute() {
    if (this.mustPayWithMegacredits()) {
      this.player.deductResource(Resources.MEGACREDITS, this.amount);
      if (this.options.afterPay !== undefined) {
        this.options.afterPay();
      }
      return undefined;
    }

    return new SelectHowToPay(
      this.options.title || 'Select how to pay for ' + this.amount + ' MCs',
      this.options.canUseSteel || false,
      this.options.canUseTitanium || false,
      this.player.canUseHeatAsMegaCredits,
      this.options.canUseSeeds || false,
      this.amount,
      (howToPay: HowToPay) => {
        this.player.deductResource(Resources.STEEL, howToPay.steel);
        this.player.deductResource(Resources.TITANIUM, howToPay.titanium);
        this.player.deductResource(Resources.MEGACREDITS, howToPay.megaCredits);
        this.player.deductResource(Resources.HEAT, howToPay.heat);
        if (howToPay.seeds > 0 && this.player.corporationCard !== undefined) {
          this.player.removeResourceFrom(this.player.corporationCard, howToPay.seeds);
        }
        if (this.options.afterPay !== undefined) {
          this.options.afterPay();
        }
        return undefined;
      },
    );
  }
}

export namespace SelectHowToPayDeferred {
  export interface Options {
    canUseSteel?: boolean;
    canUseTitanium?: boolean;
    canUseSeeds?: boolean,
    title?: string;
    afterPay?: () => void;
  };
}
