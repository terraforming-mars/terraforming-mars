import {Card} from '../Card';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
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
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class BiofertilizerFacility extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BIOFERTILIZER_FACILITY,
      tags: [Tags.MICROBE, Tags.BUILDING],
      cost: 12,
      productionDelta: Units.of({plants: 1}),

      metadata: {
        description: 'Requires 1 science tag. Increase your plant production 1 step. ' +
                  'Add up to 2 microbes to any card. ' +
                  'Place this tile which grants an ADJACENCY BONUS of 1 plant and 1 microbe.',
        cardNumber: 'A02',
        requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE)),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1));
          b.microbes(2);
          b.br;
          b.tile(TileType.BIOFERTILIZER_FACILITY, false, true);
        }),
      },
    });
  }

  public play(player: Player, game: Game) {
    player.addProduction(Resources.PLANTS, 1);
    game.defer(new AddResourcesToCard(player, ResourceType.MICROBE, {count: 2}));

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
