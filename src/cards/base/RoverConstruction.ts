import {IProjectCard} from '../IProjectCard';
import {ISpace} from '../../boards/ISpace';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {Priority} from '../../deferredActions/DeferredAction';
import {GainResources} from '../../deferredActions/GainResources';
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

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (Board.isCitySpace(space)) {
      cardOwner.game.defer(
        new GainResources(cardOwner, Resources.MEGACREDITS, {count: 2}),
        cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
      );
    }
  }

  public play() {
    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }
}
