import {Player} from '../Player';
import {SelectCard} from '../inputs/SelectCard';
import {ICard} from '../cards/ICard';
import {OrOptions} from '../inputs/OrOptions';
import {Resources} from '../Resources';
import {ResourceType} from '../ResourceType';
import {SelectOption} from '../inputs/SelectOption';
import {DeferredAction, Priority} from './DeferredAction';
import {GlobalEventName} from '../turmoil/globalEvents/GlobalEventName';

export class CorrosiveRainDeferredAction implements DeferredAction {
  public priority = Priority.DEFAULT;
  constructor(
        public player: Player,
        public title: string = 'Remove 2 floaters from a card or lose up to 10 M€',
  ) {}

  public execute() {
    const floaterCards = this.player.getCardsWithResources().filter((card) => card.resourceType === ResourceType.FLOATER &&
            card.resourceCount !== undefined &&
            card.resourceCount >= 2);

    if (floaterCards.length === 0) {
      this.player.deductResource(Resources.MEGACREDITS, 10, {log: true, from: GlobalEventName.CORROSIVE_RAIN});
      return undefined;
    }

    const selectAction = new OrOptions();
    const payMC = new SelectOption('Lose up to 10 M€', 'Lose M€', () => {
      this.player.deductResource(Resources.MEGACREDITS, 10);
      return undefined;
    });
    const removeFloaters = new SelectCard(
      'Select card to remove 2 floaters from', 'Remove floaters', floaterCards,
      (foundCards: Array<ICard>) => {
        this.player.removeResourceFrom(foundCards[0], 2);
        return undefined;
      },
    );
    selectAction.options.push(payMC, removeFloaters);

    return selectAction;
  }
}
