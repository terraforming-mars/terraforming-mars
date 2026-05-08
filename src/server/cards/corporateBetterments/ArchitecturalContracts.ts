// ============================================================
// Architectural Contracts - B02
// Active: Req own a city on Mars.
// Effect: When you play a City or City Standard Project, pay 3 M€ less.
// 2 VP.
// ============================================================
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IStandardProjectCard} from '../IStandardProjectCard';
import {IPlayer} from '../../IPlayer';
import {Size} from '../../../common/cards/render/Size';

export class ArchitecturalContracts extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ARCHITECTURAL_CONTRACTS,
      tags: [Tag.CITY],
      cost: 22,
      victoryPoints: 2,

      requirements: {cities: 1},

      cardDiscount: {tag: Tag.CITY, amount: 3},

      metadata: {
        cardNumber: 'B02',
        description: 'Requires you own a City on Mars.',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a City card or the City Standard Project, you pay 3 M€ less.', (eb) => {
            eb.city({size: Size.SMALL}).slash().city({size: Size.SMALL}).startEffect.megacredits(-3);
          });
        }),
      },
    });
  }

  public getStandardProjectDiscount(_player: IPlayer, card: IStandardProjectCard): number {
    if (card.name === CardName.CITY_STANDARD_PROJECT) {
      return 3;
    }
    return 0;
  }
}
