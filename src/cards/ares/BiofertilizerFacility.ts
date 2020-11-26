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
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class BiofertilizerFacility implements IProjectCard {
    public cost = 12;
    public tags = [Tags.MICROBES, Tags.STEEL];
    public cardType = CardType.AUTOMATED;
    public name = CardName.BIOFERTILIZER_FACILITY;

    public metadata: CardMetadata = {
      description: 'Requires 1 science tag. Increase your plant production 1 step. ' +
          'Add up to 2 microbes to any card. ' +
          'Place this tile which grants an ADJACENCY BONUS of 1 plant and 1 microbe.',
      cardNumber: 'A02',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.plants(1));
        b.microbes(2);
        b.br;
        b.tile(TileType.BIOFERTILIZER_FACILITY);
      }),
    };
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
