import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class VenusWaystation extends Card {
  constructor() {
    super({
      name: CardName.VENUS_WAYSTATION,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS, Tags.SPACE],
      cost: 9,

      metadata: {
        cardNumber: '258',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Venus tag, you pay 2 MC less for it.', (eb)=> {
            eb.venus(1).played.startEffect.megacredits(-2);
          });
        }),
        victoryPoints: 1,
      },
    });
  };

  public play() {
    return undefined;
  }
  public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
    return card.tags.filter((tag) => tag === Tags.VENUS).length * 2;
  }
  public getVictoryPoints() {
    return 1;
  }
}
