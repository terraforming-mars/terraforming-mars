import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../common/CardResource';
import {MoonCards} from '../../moon/MoonCards';
import {IActionCard, ICard} from '../ICard';
import {Card} from '../Card';
import {SelectCard} from '../../inputs/SelectCard';

export class DarksideObservatory extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      name: CardName.DARKSIDE_OBSERVATORY,
      cardType: CardType.ACTIVE,
      tags: [Tags.SCIENCE],
      cost: 12,

      metadata: {
        cardNumber: 'M75',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Science to ANY card [EXCEPT those giving 2 VP or more per science resource.]', (ab) => {
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
    return player.playedCards.some((c) => this.include(c)) || (player.corporationCard !== undefined && this.include(player.corporationCard));
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
    const playableCards: Array<ICard> = player.playedCards.filter((c) => this.include(c));
    if (player.corporationCard !== undefined && this.include(player.corporationCard)) {
      playableCards.push(player.corporationCard);
    }

    return new SelectCard(
      'Select card to add EITHER 1 Science resource OR 2 Data resources',
      'Add',
      playableCards,
      (card) => {
        this.addResource(card[0], player);
        return undefined;
      });
  }

  public play() {
    return undefined;
  }
}
