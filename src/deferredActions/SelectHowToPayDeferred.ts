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

  public execute() {
    if ((!this.player.canUseHeatAsMegaCredits || this.player.heat === 0) &&
            (!this.options.canUseSteel || this.player.steel === 0) &&
            (!this.options.canUseTitanium || this.player.titanium === 0)) {
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
      this.amount,
      (howToPay: HowToPay) => {
        this.player.deductResource(Resources.STEEL, howToPay.steel);
        this.player.deductResource(Resources.TITANIUM, howToPay.titanium);
        this.player.deductResource(Resources.MEGACREDITS, howToPay.megaCredits);
        this.player.deductResource(Resources.HEAT, howToPay.heat);
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
    title?: string;
    afterPay?: () => void;
  };
}
