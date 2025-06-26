import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';
import {isSpecialTileSpace, Board} from '../../boards/Board';

export class RareEarthElements extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.RARE_EARTH_ELEMENTS,
      cost: 5,
      tags: [Tag.EARTH, Tag.MARS],

      metadata: {
        cardNumber: 'Pf06',
        renderData: CardRenderer.builder((b) => {
          b.production(((pb) => pb.megacredits(1))).slash().specialTile();
        }),
        description: 'Increase your M€ production by 1 for every special tile you own on Mars.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const spaces = player.game.board.spaces
      .filter(Board.ownedBy(player))
      .filter(isSpecialTileSpace);

    player.production.add(Resource.MEGACREDITS, spaces.length, {log: true});
    return undefined;
  }
}

