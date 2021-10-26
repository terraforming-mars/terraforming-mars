import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {SelectSpace} from '../../inputs/SelectSpace';
import {SpaceType} from '../../SpaceType';
import {CardName} from '../../CardName';
import {MAX_OCEAN_TILES} from '../../constants';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class ArtificialLake extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ARTIFICIAL_LAKE,
      tags: [Tags.BUILDING],
      cost: 15,
      tr: {oceans: 1},

      requirements: CardRequirements.builder((b) => b.temperature(-6)),
      metadata: {
        description: 'Requires -6 C or warmer. Place 1 ocean tile ON AN AREA NOT RESERVED FOR OCEAN.',
        cardNumber: '116',
        renderData: CardRenderer.builder((b) => b.oceans(1).asterix()),
        victoryPoints: 1,
      },
    });
  }

  public play(player: Player) {
    if (player.game.board.getOceansOnBoard() >= MAX_OCEAN_TILES) return undefined;

    return new SelectSpace('Select a land space to place an ocean', player.game.board.getAvailableSpacesOnLand(player), (foundSpace: ISpace) => {
      player.game.addOceanTile(player, foundSpace.id, SpaceType.LAND);
      return undefined;
    });
  }
  public getVictoryPoints() {
    return 1;
  }
}
