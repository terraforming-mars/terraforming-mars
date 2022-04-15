import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../common/CardResource';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class VenusianPlants extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.VENUSIAN_PLANTS,
      cost: 13,
      tags: [Tags.VENUS, Tags.PLANT],
      tr: {venus: 1},

      requirements: CardRequirements.builder((b) => b.venus(16)),
      victoryPoints: 1,

      metadata: {
        cardNumber: '261',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).br.br; // intentional double br
          b.microbes(1, {secondaryTag: Tags.VENUS}).nbsp;
          b.or().nbsp.animals(1, {secondaryTag: Tags.VENUS});
        }),
        description: {
          text: 'Requires Venus 16%. Raise Venus 1 step. Add 1 Microbe or 1 Animal to ANOTHER VENUS CARD',
          align: 'left',
        },
      },
    });
  }

  public play(player: Player) {
    player.game.increaseVenusScaleLevel(player, 1);
    const cards = this.getResCards(player);
    if (cards.length === 0) return undefined;

    if (cards.length === 1) {
      player.addResourceTo(cards[0], {log: true});
      return undefined;
    }

    return new SelectCard(
      'Select card to add 1 resource',
      'Add resource',
      cards,
      (foundCards: Array<ICard>) => {
        player.addResourceTo(foundCards[0], {log: true});
        return undefined;
      },
    );
  }

  public getResCards(player: Player): ICard[] {
    let resourceCards = player.getResourceCards(CardResource.MICROBE);
    resourceCards = resourceCards.concat(player.getResourceCards(CardResource.ANIMAL));
    return resourceCards.filter((card) => card.tags.includes(Tags.VENUS));
  }
}
