import {Card} from '../Card';
import {CardName} from '../../CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {SpaceBonus} from '../../SpaceBonus';
import {TileType} from '../../TileType';
import {CardType} from './../CardType';
import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class OceanFarm extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.OCEAN_FARM,
      tags: [Tags.PLANT, Tags.BUILDING],
      cost: 15,
      productionBox: Units.of({plants: 1, heat: 1}),

      requirements: CardRequirements.builder((b) => b.oceans(4)),
      metadata: {
        cardNumber: 'A21',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.heat(1).br;
            pb.plants(1);
          }).nbsp.tile(TileType.OCEAN_FARM, false, true);
        }),
        description: 'Requires 4 ocean tiles. Increase your heat production 1 step and increase your plant production 1 step. Place this tile on top of an existing ocean tile. The tile grants an ADJACENCY BONUS of 1 plant.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.HEAT, 1);
    player.addProduction(Resources.PLANTS, 1);

    return new SelectSpace(
      'Select space for Ocean Farm',
      player.game.board.getOceansTiles(false),
      (space: ISpace) => {
        const tile = {
          tileType: TileType.OCEAN_FARM,
          card: this.name,
          covers: space.tile,
        };
        player.game.addTile(player, space.spaceType, space, tile);
        space.adjacency = {bonus: [SpaceBonus.PLANT]};
        return undefined;
      },
    );
  }
}
