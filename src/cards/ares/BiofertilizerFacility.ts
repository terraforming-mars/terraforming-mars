import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../ISpace';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {ResourceType} from '../../ResourceType';
import {SpaceBonus} from '../../SpaceBonus';
import {SpaceType} from '../../SpaceType';
import {TileType} from '../../TileType';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

export class BiofertilizerFacility implements IProjectCard {
    public cost = 12;
    public tags = [Tags.MICROBES, Tags.STEEL];
    public cardType = CardType.AUTOMATED;
    public name = CardName.BIOFERTILIZER_FACILITY;

    public canPlay(player: Player, _game: Game): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 1;
    }

    public play(player: Player, game: Game) {
      player.addProduction(Resources.PLANTS, 1);

      game.defer(new AddResourcesToCard(player, game, ResourceType.MICROBE, 2));

      return new SelectSpace(
        'Select space for Biofertilizer Facility tile',
        game.board.getAvailableSpacesOnLand(player),
        (space: ISpace) => {
          game.addTile(player, SpaceType.LAND, space, {
            tileType: TileType.BIOFERTILIZER_FACILITY,
            card: this.name,
          });
          space.adjacency = {
            bonus: [SpaceBonus.PLANT, SpaceBonus.MICROBE],
          };
          return undefined;
        },
      );
    }
}
