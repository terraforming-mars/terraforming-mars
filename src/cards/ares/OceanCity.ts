import {Card} from '../Card';
import {CardName} from '../../CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {TileType} from '../../TileType';
import {CardType} from './../CardType';
import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class OceanCity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.OCEAN_CITY,
      tags: [Tags.CITY, Tags.BUILDING],
      cost: 18,
      productionBox: Units.of({energy: -1, megacredits: 3}),

      requirements: CardRequirements.builder((b) => b.oceans(6)),
      metadata: {
        cardNumber: 'A20',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).nbsp.tile(TileType.OCEAN_CITY, false, true);
        }),
        description: 'Requires 6 ocean tiles. Decrease your Energy production 1 step and increase your M€ production 3 steps. Place this tile on top of an existing ocean tile, IGNORING NORMAL PLACEMENT RESTRICTIONS FOR CITIES. The tile counts as a city as well as an ocean.',
      },
    });
  }

  public override canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) > 0;
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.MEGACREDITS, 3);

    return new SelectSpace(
      'Select space for Ocean City',
      player.game.board.getOceansTiles(false),
      (space: ISpace) => {
        const tile = {
          tileType: TileType.OCEAN_CITY,
          card: this.name,
          covers: space.tile,
        };
        player.game.addTile(player, space.spaceType, space, tile);
        return undefined;
      },
    );
  }
}
