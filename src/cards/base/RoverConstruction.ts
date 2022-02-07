import {IProjectCard} from '../IProjectCard';
import {ISpace} from '../../boards/ISpace';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Resources} from '../../common/Resources';
import {Priority} from '../../deferredActions/DeferredAction';
import {GainResources} from '../../deferredActions/GainResources';
import {Board} from '../../boards/Board';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {all} from '../Options';

export class RoverConstruction extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ROVER_CONSTRUCTION,
      tags: [Tags.BUILDING],
      cost: 8,
      victoryPoints: 1,

      metadata: {
        cardNumber: '038',
        renderData: CardRenderer.builder((b) => {
          b.effect('When any City tile is placed, gain 2 M€.', (eb) => {
            eb.city({size: Size.SMALL, all}).startEffect.megacredits(2);
          });
        }),
      },
    });
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (Board.isCitySpace(space)) {
      cardOwner.game.defer(
        new GainResources(cardOwner, Resources.MEGACREDITS, {count: 2, log: true}),
        cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
      );
    }
  }

  public play() {
    return undefined;
  }
}
