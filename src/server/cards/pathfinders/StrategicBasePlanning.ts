import {IPlayer} from '../../IPlayer';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';
import {PathfindersExpansion} from '../../pathfinders/PathfindersExpansion';

export class StrategicBasePlanning extends PreludeCard {
  constructor() {
    super({
      name: CardName.STRATEGIC_BASE_PLANNING,
      tags: [Tag.BUILDING],

      startingMegacredits: -8,

      behavior: {
        colonies: {buildColony: {}},
        city: {},
      },

      metadata: {
        cardNumber: 'P08',
        renderData: CardRenderer.builder((b) => {
          b.minus().megacredits(8).city().colonies();
        }),
        description: 'Pay 8M€. Place a city. Place a colony.',
      },
    });
  }
  public override bespokePlay(player: IPlayer) {
    player.stock.deduct(Resource.MEGACREDITS, 8);
    PathfindersExpansion.addToSolBank(player);
    return undefined;
  }
}

