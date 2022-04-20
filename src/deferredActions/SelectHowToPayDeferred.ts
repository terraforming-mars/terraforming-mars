import {Player} from '../Player';
import {SelectHowToPay} from '../inputs/SelectHowToPay';
import {HowToPay} from '../common/inputs/HowToPay';
import {DeferredAction, Priority} from './DeferredAction';
import {Resources} from '../common/Resources';

export class SelectHowToPayDeferred extends DeferredAction {
  constructor(
    player: Player,
    public amount: number,
    public options: SelectHowToPayDeferred.Options = {},
  ) {
    super(player, Priority.DEFAULT);
  }

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
    if (this.options.canUseData && (this.player.corporationCard?.resourceCount ?? 0 > 0)) {
      return false;
    }
    return true;
  }

  public execute() {
    if (this.mustPayWithMegacredits()) {
      this.player.deductResource(Resources.MEGACREDITS, this.amount);
      this.options.afterPay?.();
      return undefined;
    }

    return new SelectHowToPay(
      this.options.title || 'Select how to pay for ' + this.amount + ' MCs',
      this.options.canUseSteel || false,
      this.options.canUseTitanium || false,
      this.player.canUseHeatAsMegaCredits,
      this.options.canUseSeeds || false,
      this.options.canUseData || false,
      this.amount,
      (howToPay: HowToPay) => {
        this.player.deductResource(Resources.STEEL, howToPay.steel);
        this.player.deductResource(Resources.TITANIUM, howToPay.titanium);
        this.player.deductResource(Resources.MEGACREDITS, howToPay.megaCredits);
        this.player.deductResource(Resources.HEAT, howToPay.heat);
        if (howToPay.seeds > 0 && this.player.corporationCard !== undefined) {
          this.player.removeResourceFrom(this.player.corporationCard, howToPay.seeds);
        }
        if (howToPay.data > 0 && this.player.corporationCard !== undefined) {
          this.player.removeResourceFrom(this.player.corporationCard, howToPay.data);
        }
        this.options.afterPay?.();
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
    canUseData?: boolean,
    title?: string;
    afterPay?: () => void;
  }
}
