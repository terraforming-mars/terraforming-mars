import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../../common/boards/SpaceType';
import {IActionCard, ICard} from '../ICard';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class MaxwellBase extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.MAXWELL_BASE,
      cardType: CardType.ACTIVE,
      tags: [Tag.CITY, Tag.VENUS],
      cost: 18,

      requirements: CardRequirements.builder((b) => b.venus(12)),
      victoryPoints: 3,
      behavior: {
        production: {energy: -1},
        city: {space: SpaceName.MAXWELL_BASE, type: SpaceType.COLONY},
      },

      metadata: {
        cardNumber: '238',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 resource to ANOTHER VENUS CARD.', (eb) => {
            eb.empty().startAction.wild(1, {secondaryTag: Tag.VENUS});
          }).br;
          b.production((pb) => pb.minus().energy(1)).nbsp.city().asterix();
        }),
        description: {
          text: 'Requires Venus 12%. Decrease your energy production 1 step. Place a City tile ON THE RESERVED AREA.',
          align: 'left',
        },
      },
    });
  }

  public getResCards(player: Player): ICard[] {
    return player.getResourceCards().filter((card) => card.tags.includes(Tag.VENUS));
  }

  public canAct(player: Player): boolean {
    return this.getResCards(player).length > 0;
  }

  public action(player: Player) {
    const cards = this.getResCards(player);

    if (cards.length === 1) {
      player.addResourceTo(cards[0], {log: true});
      return undefined;
    }

    return new SelectCard(
      'Select card to add 1 resource',
      'Add resource',
      cards,
      ([card]) => {
        player.addResourceTo(card, {log: true});
        return undefined;
      },
    );
  }
}
