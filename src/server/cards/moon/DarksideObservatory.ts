import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
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
      cardType: CardType.ACTIVE,
      tags: [Tag.SCIENCE],
      cost: 12,

      metadata: {
        cardNumber: 'M75',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 science to ANY card [EXCEPT those giving 2 VP or more per science resource.]', (ab) => {
            ab.empty().startAction.science(1).asterix();
          }).br;
          b.or().br;
          b.action('Add 2 Data to ANY card.', (ab) => {
            ab.empty().startAction.data({amount: 2}).asterix();
          });
        }),
      },
    });
  }

  private include(card: ICard) {
    return card.resourceType === CardResource.DATA || MoonCards.scienceCardsWithLessThan2VP.has(card.name);
  }

  public canAct(player: Player) {
    return player.playedCards.some(this.include) || player.corporations.some(this.include);
  }

  private addResource(card: ICard, player: Player): void {
    if (card.resourceType === CardResource.DATA) {
      player.addResourceTo(card, {qty: 2, log: true});
    }
    if (card.resourceType === CardResource.SCIENCE) {
      player.addResourceTo(card, {qty: 1, log: true});
    }
  }

  public action(player: Player) {
    const playableCards = [
      ...player.playedCards.filter((c) => this.include(c)),
      ...player.corporations.filter((c) => this.include(c)),
    ];

    return new SelectCard(
      'Select card to add EITHER 1 science resource OR 2 Data resources',
      'Add',
      playableCards,
      ([card]) => {
        this.addResource(card, player);
        return undefined;
      });
  }
}
