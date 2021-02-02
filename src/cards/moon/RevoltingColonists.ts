import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';

export class RevoltingColonists extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.REVOLTING_COLONISTS,
      cardType: CardType.EVENT,
      tags: [Tags.MOON, Tags.EVENT],
      cost: 3,
      requirements: CardRequirements.builder((b) => b.colonyRate(4)),

      metadata: {
        description: 'Requires 4 Colony Rate. All players pay 3MC for each colony tile they own.',
        cardNumber: 'M51',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(3).slash().tile(TileType.MOON_COLONY, false).asterix();
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    return MoonExpansion.moonData(player.game).colonyRate >= 4;
  }

  public play(player: Player) {
    const colonies = MoonExpansion.tiles(player.game, TileType.MOON_COLONY, false);
    player.game.getPlayers().forEach((colonyTileOwner) => {
      const owned = colonies.filter((colony) => colony.player?.id === colonyTileOwner.id).length;
      if (owned > 0) {
        const owes = owned * 3;
        const spent = Math.min(owes, colonyTileOwner.megaCredits);
        colonyTileOwner.megaCredits -= spent;
        player.game.log(
          '${0} spends ${1} MC for the ${2} colonies they own.',
          (b) => b.player(colonyTileOwner).number(spent).number(owned));
      }
    });
    return undefined;
  }
}
