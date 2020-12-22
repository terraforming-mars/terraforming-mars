import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../ISpace';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {SpaceBonus} from '../../SpaceBonus';
import {SpaceType} from '../../SpaceType';
import {TileType} from '../../TileType';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SolarFarm implements IProjectCard {
    public cost = 12;
    public tags = [Tags.ENERGY, Tags.STEEL];
    public cardType = CardType.AUTOMATED;
    public name = CardName.SOLAR_FARM;

    public canPlay(player: Player, game: Game): boolean {
      return game.board.getAvailableSpacesOnLand(player).length > 0;
    }

    public play(player: Player, game: Game) {
      return new SelectSpace(
        'Select space for Solar Farm tile',
        game.board.getAvailableSpacesOnLand(player),
        (space: ISpace) => {
          const plantsOnSpace = space.bonus.filter((b) => b === SpaceBonus.PLANT).length;
          player.addProduction(Resources.ENERGY, plantsOnSpace, game);

          game.addTile(player, SpaceType.LAND, space, {
            tileType: TileType.SOLAR_FARM,
            card: this.name,
          });
          space.adjacency = {bonus: [SpaceBonus.POWER, SpaceBonus.POWER]};
          return undefined;
        },
      );
    }
    public metadata: CardMetadata = {
      cardNumber: 'A17',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.energy(1).slash().plants(1);
        }).asterix().nbsp.tile(TileType.SOLAR_FARM, false, true).br;
      }),
      description: 'Place this tile which grants an ADJACENCY BONUS of 2 energy. Increase your power production 1 step for each plant resource on the area where you place the tile.',
    }
}
