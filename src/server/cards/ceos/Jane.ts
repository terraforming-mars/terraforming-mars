import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {IActionCard, ICard, isIActionCard, isIHasCheckLoops} from '../ICard';
import {SelectCard} from '../../inputs/SelectCard';

export class Jane extends CeoCard {
  constructor() {
    super({
      name: CardName.JANE,
      metadata: {
        cardNumber: 'L40',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('RESET X-1').cards(1, {secondaryTag: AltSecondaryTag.BLUE}).asterix();
        }),
        description: 'Once per game, mark up to X-1 blue card actions as unused this generation, where X is the current generation number.',
      },
    });
  }

  public override canAct(player: IPlayer): boolean {
    // Minor performance boost if we perform these checks before running usedActionCards:
    if (this.isDisabled || player.game.generation === 1) {
      return false;
    }
    return this.getActionCards(player).length > 0;
  }

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    const game = player.game;
    const cardSelectionCount = Math.min(game.generation - 1, this.getActionCards(player).length);

    const actionCards = this.getActionCards(player);
    if (actionCards.length === 0) {
      // Pretty sure this will never trigger?  Just in case?
      player.game.log('${0} had no unused action cards', (b) => b.player(player));
      return undefined;
    }
    const msg = `Select up ${cardSelectionCount} actions to mark as unused`;
    return new SelectCard(
      msg,
      'Select',
      actionCards,
      (cards) => {
        for (const card of cards) {
          player.game.log('${0} marked action card ${1} as unused.', (b) => b.player(player).card(card));
          player.deleteActionThisGeneration(card.name);
          return undefined;
        }
        return undefined;
      },
      {max: cardSelectionCount, min: 0});
  }

  // This is _similar_ to Viron.getActionCards, but does not require playedCard.canAct.
  private getActionCards(player: IPlayer): Array<IActionCard & ICard> {
    const result: Array<IActionCard & ICard> = [];
    for (const playedCard of player.tableau) {
      if (playedCard === this) {
        continue;
      }
      if (!isIActionCard(playedCard)) {
        continue;
      }
      if (isIHasCheckLoops(playedCard) && playedCard.getCheckLoops() >= 2) {
        continue;
      }
      if (player.getActionsThisGeneration().has(playedCard.name)) {
        result.push(playedCard);
      }
    }
    return result;
  }
}
