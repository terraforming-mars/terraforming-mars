import {IProjectCard} from '@/server/cards/IProjectCard';
import {CanAffordOptions, IPlayer} from '@/server/IPlayer';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Tag} from '@/common/cards/Tag';
import {SelectSpace} from '@/server/inputs/SelectSpace';
import {CardResource} from '@/common/CardResource';
import {TileType} from '@/common/TileType';
import {message} from '@/server/logs/MessageBuilder';

export class MartianNatureWonders extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.MARTIAN_NATURE_WONDERS,
      cost: 13,
      tags: [Tag.MARS],
      victoryPoints: 2,

      behavior: {
        addResourcesToAnyCard: {type: CardResource.DATA, count: 2},
      },

      metadata: {
        cardNumber: 'Pf10',
        renderData: CardRenderer.builder((b) => {
          b.resource(CardResource.RESOURCE_CUBE).asterix().br;
          b.resource(CardResource.DATA, 2).asterix();
        }),
        description: 'Place a neutral player cube on a non-reserved space. No tile can be placed on that space this game. ' +
        'Gather any bonus on that space, but no bonuses from adjacent spaces. Add 2 data to ANY card.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer, canAffordOptions: CanAffordOptions) {
    return player.game.board.getAvailableSpacesOnLand(player, canAffordOptions).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectSpace(
      message('Select space for ${0}', (b) => b.card(this)),
      player.game.board.getAvailableSpacesOnLand(player))
      .andThen((space) => {
        player.game.simpleAddTile(player, space, {tileType: TileType.MARTIAN_NATURE_WONDERS});
        player.game.grantSpaceBonuses(player, space);
        return undefined;
      });
  }
}
