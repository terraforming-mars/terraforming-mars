import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {TileType} from '../../../common/TileType';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {IPlayer} from '../../IPlayer';

export class NewHolland extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.NEW_HOLLAND,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 20,

      behavior: {
        production: {megacredits: 3},
        tile: {
          type: TileType.NEW_HOLLAND,
          on: 'upgradeable-ocean-new-holland',
        },
      },

      requirements: {cities: 4, all},

      metadata: {
        cardNumber: 'X-2',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(3);
          }).nbsp.tile(TileType.NEW_HOLLAND);
        }),
        description: 'Requires 4 city tiles ON MARS. Increase your M€ production 3 steps. ' +
            'Place a city tile on top of an already placed ocean tile, FOLLOWING NORMAL CITY PLACEMENT RESTRICTIONS. The tile counts as a city and an ocean.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return player.game.board.getCitiesOnMars().length >= 4;
  }
}

