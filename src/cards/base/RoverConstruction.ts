import {IProjectCard} from '../IProjectCard';
import {ISpace} from '../../boards/ISpace';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Board} from '../../boards/Board';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class RoverConstruction extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ROVER_CONSTRUCTION,
      tags: [Tags.BUILDING],
      cost: 8,

      metadata: {
        cardNumber: '038',
        renderData: CardRenderer.builder((b) => {
          b.effect('When any City tile is placed, gain 2 MC.', (eb) => {
            eb.city(CardRenderItemSize.SMALL).any.startEffect.megacredits(2);
          });
        }),
        victoryPoints: 1,
      },
    });
  }
  public onTilePlaced(player: Player, space: ISpace) {
    if (Board.isCitySpace(space)) {
      player.megaCredits += 2;
    }
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
