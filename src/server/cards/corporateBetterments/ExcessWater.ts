// ============================================================
// Excess Water - B27
// Effect: +2 M€ from Ocean adjacency bonuses
// NOTE: This card modifies how adjacency bonuses are calculated.
// The existing engine doesn't expose a clean hook for this.
// Simplest approximation: immediate gain of 2 MC per Ocean tile placed
// after this card is in play. Uses onTilePlaced hook.
// ============================================================
import {Card as Card27} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {Board} from '../../boards/Board';
import {Resource} from '../../../common/Resource';
import {Priority} from '../../deferredActions/Priority';
import {GainResourcesDeferred} from '../../deferredActions/GainResourcesDeferred';

export class ExcessWater extends Card27 implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.EXCESS_WATER,
      cost: 8,

      metadata: {
        cardNumber: 'B27',
        description: 'Effect: You get 2 M€ more from Ocean adjacency bonuses.',
        renderData: CardRenderer.builder((b) => {
          b.effect('When any Ocean tile is placed, gain 2 M€.', (eb) => {
            eb.oceans(1).startEffect.megacredits(2);
          });
        }),
      },
    });
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space) {
    if (Board.isOceanSpace(space)) {
      cardOwner.game.defer(
        new GainResourcesDeferred(cardOwner, Resource.MEGACREDITS, {count: 2, log: true}),
        cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
      );
    }
  }
}
