import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {ResourceType} from '../../ResourceType';
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
          b.action('Add 1 Science to ANY card (except those giving 2 VP or more per science resource.)', (ab) => {
            ab.startAction.science(1);
          }).br;
          b.or().br;
          b.action('Add 2 Data to ANY card.', (ab) => {
            ab.startAction.data().data();
          });
        }),
      },
    });
  };

  private include(card: ICard) {
    return card.resourceType === ResourceType.DATA || MoonCards.scienceCardsWithLessThan2VP.has(card.name);
  }

  public canAct(player: Player) {
    return player.playedCards.some((c) => this.include(c));
  }

  private addResource(card: IProjectCard, player: Player): void {
    if (card.resourceType === ResourceType.DATA) {
      player.addResourceTo(card, 2);
    }
    if (card.resourceType === ResourceType.SCIENCE) {
      player.addResourceTo(card, 1);
    }
  }

  public action(player: Player) {
    const playableCards = player.playedCards.filter((c) => this.include(c));

    return new SelectCard(
      'Select card to add 1 Science resource OR 2 Data resources',
      'Add resource',
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
