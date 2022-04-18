import {Card} from '../Card';
import {CardName} from '../../common/cards/CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardResource} from '../../common/CardResource';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceType} from '../../common/boards/SpaceType';
import {TileType} from '../../common/TileType';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class BiofertilizerFacility extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BIOFERTILIZER_FACILITY,
      tags: [Tags.MICROBE, Tags.BUILDING],
      cost: 12,
      productionBox: Units.of({plants: 1}),

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE)),
      metadata: {
        description: 'Requires 1 science tag. Increase your plant production 1 step. ' +
                  'Add up to 2 microbes to any card. ' +
                  'Place this tile which grants an ADJACENCY BONUS of 1 plant and 1 microbe.',
        cardNumber: 'A02',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1));
          b.microbes(2);
          b.br;
          b.tile(TileType.BIOFERTILIZER_FACILITY, false, true);
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 1);
    player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {count: 2}));

    return new SelectSpace(
      'Select space for Biofertilizer Facility tile',
      player.game.board.getAvailableSpacesOnLand(player),
      (space: ISpace) => {
        player.game.addTile(player, SpaceType.LAND, space, {
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
