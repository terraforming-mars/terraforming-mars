import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {MoonCards} from '../../moon/MoonCards';
import {IActionCard, ICard} from '../ICard';
import {Card} from '../Card';
import {SelectCard} from '../../inputs/SelectCard';

export class DarksideObservatory extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      name: CardName.DARKSIDE_OBSERVATORY,
      type: CardType.ACTIVE,
      tags: [Tag.SCIENCE],
      cost: 12,

      metadata: {
        cardNumber: 'M75',
        renderData: CardRenderer.builder((b) => {
          b.arrow().resource(CardResource.SCIENCE).asterix().nbsp.or().br;
          b.arrow().resource(CardResource.DATA, 2).asterix().br;

          b.plainText('Action: Add 1 science to ANY card [EXCEPT those giving 2 VP or more per science resource.], or add 2 data to ANY card.', /* parens */ true);
        }),
      },
    });
  }

  private include(card: ICard) {
    return card.resourceType === CardResource.DATA || MoonCards.scienceCardsWithLessThan2VP.has(card.name);
  }

  public canAct(player: IPlayer) {
    return player.playedCards.some(this.include);
  }

  private addResource(card: ICard, player: IPlayer): void {
    if (card.resourceType === CardResource.DATA) {
      player.addResourceTo(card, {qty: 2, log: true});
    }
    if (card.resourceType === CardResource.SCIENCE) {
      player.addResourceTo(card, {qty: 1, log: true});
    }
  }

  public action(player: IPlayer) {
    const playableCards = player.playedCards.filter((c) => this.include(c));

    if (playableCards.length === 1) {
      this.addResource(playableCards[0], player);
      return;
    }

    return new SelectCard(
      'Select card to add EITHER 1 science resource OR 2 Data resources',
      'Add',
      playableCards)
      .andThen(([card]) => {
        this.addResource(card, player);
        return undefined;
      });
  }
}
