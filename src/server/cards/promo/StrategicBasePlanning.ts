import {IPlayer} from '../../IPlayer';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';

export class StrategicBasePlanning extends PreludeCard {
  constructor() {
    super({
      name: CardName.STRATEGIC_BASE_PLANNING,
      tags: [Tag.CITY, Tag.BUILDING, Tag.SPACE],

      startingMegacredits: -3,

      behavior: {
        colonies: {buildColony: {}},
        city: {},
      },

      metadata: {
        cardNumber: 'X65',
        renderData: CardRenderer.builder((b) => {
          b.minus().megacredits(3).city().colonies();
        }),
        description: 'Pay 3M€. Place a city. Place a colony.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return player.canAfford(3);
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new SelectPaymentDeferred(player, -this.startingMegaCredits)).andThen(() => {
      PathfindersExpansion.addToSolBank(player);
    });
    return undefined;
  }
}

