import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../../common/cards/Tags';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {ResourceType} from '../../common/ResourceType';
import {TileType} from '../../common/TileType';

export class MartianNatureWonders extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MARTIAN_NATURE_WONDERS,
      cost: 13,
      tags: [Tags.MARS],
      victoryPoints: 2,

      metadata: {
        cardNumber: 'Pf10',
        renderData: CardRenderer.builder((b) => {
          b.resourceCube().asterix().br;
          b.data({amount: 2}).asterix;
        }),
        description: 'Place a neutral player cube on a non-reserved space. No tile can be placed on that space this game. ' +
        'Gather any bonus on that space, but no bonuses from adjacent spaces. Place 2 data on any card.',
      },
    });
  }

  public override canPlay(player: Player) {
    return player.game.board.getAvailableSpacesOnLand(player).length > 0;
  }

  public play(player: Player) {
    player.game.defer(new AddResourcesToCard(player, ResourceType.DATA, {count: 2}));
    return new SelectSpace('Select a Martian Natural Wonder space',
      player.game.board.getAvailableSpacesOnLand(player),
      (space: ISpace) => {
        player.game.simpleAddTile(player, space, {tileType: TileType.MARTIAN_NATURE_WONDERS});
        player.game.grantSpaceBonuses(player, space);
        return undefined;
      });
  }
}
