import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {TileType} from '../../TileType';
import {CardType} from './../CardType';
import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class OceanCity implements IProjectCard {
  public cost = 18;
  public tags = [Tags.CITY, Tags.BUILDING];
  public cardType = CardType.AUTOMATED;
  public name = CardName.OCEAN_CITY;

  public canPlay(player: Player, game: Game): boolean {
    return (player.getProduction(Resources.ENERGY) > 0) &&
        (game.board.getOceansOnBoard() >= 6 - player.getRequirementsBonus(game));
  }

  public play(player: Player, game: Game) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.MEGACREDITS, 3);

    return new SelectSpace(
      'Select space for Ocean City',
      game.board.getOceansTiles(false),
      (space: ISpace) => {
        game.removeTile(space.id);
        game.addTile(player, space.spaceType, space, {
          tileType: TileType.OCEAN_CITY,
          card: this.name,
        });
        return undefined;
      },
    );
  }
  public metadata: CardMetadata = {
    cardNumber: 'A20',
    requirements: CardRequirements.builder((b) => b.oceans(6)),
    renderData: CardRenderer.builder((b) => {
      b.productionBox((pb) => {
        pb.minus().energy(1).br;
        pb.plus().megacredits(3);
      }).nbsp.tile(TileType.OCEAN_CITY, false, true);
    }),
    description: 'Requires 6 ocean tiles. Decrease your Energy production 1 step and increase your MC production 3 steps. Place this tile on top of an existing ocean tile, IGNORING NORMAL PLACEMENT RESTRICTIONS FOR CITIES. The tile counts as a city as well as an ocean.',
  }
}
