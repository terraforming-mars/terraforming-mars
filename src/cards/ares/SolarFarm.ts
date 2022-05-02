import {Card} from '../Card';
import {CardName} from '../../common/cards/CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceType} from '../../common/boards/SpaceType';
import {TileType} from '../../common/TileType';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardRenderer} from '../render/CardRenderer';

export class SolarFarm extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SOLAR_FARM,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 12,

      metadata: {
        cardNumber: 'A17',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.energy(1).slash().plants(1);
          }).asterix().nbsp.tile(TileType.SOLAR_FARM, false, true).br;
        }),
        description: 'Place this tile which grants an ADJACENCY BONUS of 2 energy. Increase your power production 1 step for each plant resource on the area where you place the tile.',
      },
    });
  }

  public override canPlay(player: Player): boolean {
    return player.game.board.getAvailableSpacesOnLand(player).length > 0;
  }

  public produce(player: Player) {
    const space = player.game.board.getSpaceByTileCard(this.name);
    if (space === undefined) {
      throw new Error('Solar Farm space not found');
    }
    const plantsOnSpace = space.bonus.filter((b) => b === SpaceBonus.PLANT).length;
    player.addProduction(Resources.ENERGY, plantsOnSpace, {log: true});
  }

  public play(player: Player) {
    return new SelectSpace(
      'Select space for Solar Farm tile',
      player.game.board.getAvailableSpacesOnLand(player),
      (space: ISpace) => {
        player.game.addTile(player, SpaceType.LAND, space, {
          tileType: TileType.SOLAR_FARM,
          card: this.name,
        });
        this.produce(player);
        space.adjacency = {bonus: [SpaceBonus.ENERGY, SpaceBonus.ENERGY]};
        return undefined;
      },
    );
  }
}
