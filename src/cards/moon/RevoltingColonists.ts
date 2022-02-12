import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {Size} from '../render/Size';
import {all} from '../Options';

export class RevoltingColonists extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.REVOLTING_COLONISTS,
      cardType: CardType.EVENT,
      tags: [Tags.MOON],
      cost: 3,
      requirements: CardRequirements.builder((b) => b.colonyRate(4)),

      metadata: {
        description: 'Requires 4 Colony Rate. All players pay 3M€ for each colony tile they own.',
        cardNumber: 'M51',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(3, {all}).slash().moonColony({size: Size.SMALL, all});
        }),
      },
    });
  }

  public play(player: Player) {
    const colonies = MoonExpansion.spaces(player.game, TileType.MOON_COLONY);
    player.game.getPlayersInGenerationOrder().forEach((colonyTileOwner) => {
      const owned = colonies.filter((colony) => colony.player?.id === colonyTileOwner.id).length;
      if (owned > 0) {
        const owes = owned * 3;
        const spent = Math.min(owes, colonyTileOwner.megaCredits);
        colonyTileOwner.megaCredits -= spent;
        player.game.log(
          '${0} spends ${1} M€ for the ${2} colonies they own.',
          (b) => b.player(colonyTileOwner).number(spent).number(owned));
      }
    });
    return undefined;
  }
}
