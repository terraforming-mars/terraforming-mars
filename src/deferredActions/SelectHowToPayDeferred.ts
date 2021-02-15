import {Player} from '../Player';
import {SelectHowToPay} from '../inputs/SelectHowToPay';
import {HowToPay} from '../inputs/HowToPay';
import {DeferredAction, Priority} from './DeferredAction';

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
      this.player.megaCredits -= this.amount;
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
        this.player.steel -= howToPay.steel;
        this.player.titanium -= howToPay.titanium;
        this.player.megaCredits -= howToPay.megaCredits;
        this.player.heat -= howToPay.heat;
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
