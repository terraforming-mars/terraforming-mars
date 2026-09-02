import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {IPreludeCard} from '../prelude/IPreludeCard';
import {Board} from '../../boards/Board';
import {Resource} from '../../../common/Resource';

export class DeepwaterDome extends PreludeCard implements IPreludeCard {
  constructor() {
    super({
      name: CardName.DEEPWATER_DOME,
      tags: [Tag.PLANT, Tag.BUILDING],

      tr: {oceans: 1},
      behavior: {
        production: {plants: 1},
        ocean: {},
      },

      metadata: {
        cardNumber: 'UP11',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1)).oceans(1).br;
          b.effect('When you excavate next to an ocean, gain 2 M€.',
            (eb) => eb.excavate().asterix().startEffect.megacredits(2));
        }),
        description: 'Increase your plant production 1 step. Place an ocean.',
      },
    });
  }

  public onClaim(player: IPlayer, isExcavate: boolean, space: Space | undefined): void {
    if (isExcavate && space) {
      if (player.game.board.getAdjacentSpaces(space).some((s) => Board.isOceanSpace(s))) {
        player.stock.add(Resource.MEGACREDITS, 2);
      }
    }
  }
}

