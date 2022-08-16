import {Player} from '../Player';
import {SelectCard} from '../inputs/SelectCard';
import {OrOptions} from '../inputs/OrOptions';
import {Resources} from '../../common/Resources';
import {CardResource} from '../../common/CardResource';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction, Priority} from './DeferredAction';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';

export class CorrosiveRainDeferredAction extends DeferredAction {
  constructor(
    player: Player,
    public title: string = 'Remove 2 floaters from a card or lose up to 10 M€',
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const floaterCards = this.player.getCardsWithResources(CardResource.FLOATER).filter((card) => (card.resourceCount ?? 0) >= 2);

    const selectAction = new OrOptions();
    const payMC = new SelectOption('Lose up to 10 M€', 'Lose M€', () => {
      this.player.deductResource(Resources.MEGACREDITS, 10, {log: true, from: GlobalEventName.CORROSIVE_RAIN});
      return undefined;
    });
    const removeFloaters = new SelectCard(
      'Select card to remove 2 floaters from', 'Remove floaters', floaterCards,
      ([card]) => {
        this.player.removeResourceFrom(card, 2);
        return undefined;
      },
    );
    selectAction.options.push(payMC, removeFloaters);

    if (floaterCards.length === 0) {
      payMC.cb();
      return undefined;
    }

    return selectAction;
  }
}
