import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {IActionCard, ICard, isIActionCard, isIHasCheckLoops} from '../ICard';
import {SelectCard} from '../../inputs/SelectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class ProjectInspection extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.PROJECT_INSPECTION,
      cost: 0,

      metadata: {
        cardNumber: 'X02',
        renderData: CardRenderer.builder((b) => {
          b.text('Use a card action that has been used this generation.', Size.SMALL, true);
        }),
      },
    });
  }
  private getActionCards(player: Player): Array<IActionCard & ICard> {
    const result: Array<IActionCard & ICard> = [];

    for (const playedCard of player.tableau) {
      if (isIHasCheckLoops(playedCard) && playedCard.getCheckLoops() >= 2) continue;
      if (isIActionCard(playedCard) && playedCard.canAct(player) && player.getActionsThisGeneration().has(playedCard.name)) {
        result.push(playedCard);
      }
    }
    return result;
  }

  public override bespokeCanPlay(player: Player): boolean {
    return this.getActionCards(player).length > 0;
  }

  public override bespokePlay(player: Player) {
    const actionCards = this.getActionCards(player);
    if (actionCards.length === 0 ) {
      return undefined;
    }
    return new SelectCard<IActionCard & ICard>(
      'Perform an action from a played card again',
      'Take action',
      actionCards,
      ([card]) => {
        const foundCard = card;
        player.game.log('${0} used ${1} action with ${2}', (b) => b.player(player).card(foundCard).card(this));
        return foundCard.action(player);
      },
    );
  }
}
