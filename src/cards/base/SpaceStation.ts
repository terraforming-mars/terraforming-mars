import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SpaceStation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SPACE_STATION,
      tags: [Tags.SPACE],
      cost: 10,

      metadata: {
        cardNumber: '025',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Space card, you pay 2 MC less for it.', (eb) => {
            eb.space().played.startEffect.megacredits(-2);
          });
        }),
        victoryPoints: 1,
      },
    });
  }
  public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
    if (card.tags.indexOf(Tags.SPACE) !== -1) {
      return 2;
    }
    return 0;
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}

