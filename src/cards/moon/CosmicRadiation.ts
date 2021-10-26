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
import {Size} from '../render/Size';
import {all} from '../Options';

export class CosmicRadiation extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.COSMIC_RADIATION,
      cardType: CardType.EVENT,
      tags: [Tags.MOON],
      cost: 3,

      requirements: CardRequirements.builder((b) => b.miningRate(4)),
      metadata: {
        description: 'Requires 4 Mining Rate. All players pay 4M€ for each mining tile they own.',
        cardNumber: 'M52',
        renderData: CardRenderer.builder((b) => {
          b.minus().megacredits(4, {all}).slash().moonMine({size: Size.SMALL, all});
        }),
      },
    });
  };

  public play(player: Player) {
    const mines = MoonExpansion.tiles(player.game, TileType.MOON_MINE);
    player.game.getPlayers().forEach((mineTileOwner) => {
      const owned = mines.filter((mine) => mine.player?.id === mineTileOwner.id).length;
      if (owned > 0) {
        const owes = owned * 4;
        // TODO(kberg): Helion player should select thieir heat expenditure.
        const spent = Math.min(owes, mineTileOwner.megaCredits);
        mineTileOwner.megaCredits -= spent;
        player.game.log(
          '${0} spends ${1} M€ for the ${2} mines they own.',
          (b) => b.player(mineTileOwner).number(spent).number(owned));
      }
    });
    return undefined;
  }
}
