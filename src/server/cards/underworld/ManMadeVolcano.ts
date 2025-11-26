import {Card} from '@/server/cards/Card';
import {CardName} from '@/common/cards/CardName';
import {TileType} from '@/common/TileType';
import {CardType} from '@/common/cards/CardType';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {IPlayer} from '@/server/IPlayer';
import {PlayerInput} from '@/server/PlayerInput';
import {PlaceTile} from '@/server/deferredActions/PlaceTile';
import {message} from '@/server/logs/MessageBuilder';
import {digit} from '@/server/cards/Options';

export class ManMadeVolcano extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.MAN_MADE_VOLCANO,
      tags: [Tag.POWER],
      cost: 26,
      tilesBuilt: [TileType.MAN_MADE_VOLCANO],

      behavior: {
        production: {
          energy: 2,
          heat: 4,
        },
      },

      metadata: {
        cardNumber: 'U017',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2, {digit}).heat(4, {digit})).br;
          b.plainText('Increase your energy production 2 steps and your heat production 4 steps.').br;
          b.tile(TileType.MAN_MADE_VOLCANO).super((b) => b.excavate(1)).br;
          b.plainText('Place this special tile on a NON-RESERVED space that has your excavation marker.').br;
        }),
      },
    });
  }

  private availableSpaces(player: IPlayer) {
    return player.game.board
      .getAvailableSpacesOnLand(player)
      .filter((space) => space.excavator === player);
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return this.availableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer): PlayerInput | undefined {
    player.game.defer(
      new PlaceTile(player, {
        tile: {tileType: TileType.MAN_MADE_VOLCANO, card: this.name},
        on: () => this.availableSpaces(player),
        title: message('Select space for ${0}', (b) => b.tileType(TileType.MAN_MADE_VOLCANO)),
        adjacencyBonus: this.adjacencyBonus,
      }));
    return undefined;
  }
}
