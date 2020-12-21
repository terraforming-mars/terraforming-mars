import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {SpaceType} from '../../SpaceType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SpaceName} from '../../SpaceName';
import {TileType} from '../../TileType';
import {ISpace} from '../../ISpace';
import {SelectSpace} from '../../inputs/SelectSpace';
import {BoardName} from '../../boards/BoardName';
import {CardName} from '../../CardName';
import {MAX_TEMPERATURE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';


export class LavaFlows implements IProjectCard {
    public cost = 18;
    public tags = [];
    public name = CardName.LAVA_FLOWS;
    public hasRequirements = false;
    public cardType = CardType.EVENT;
    public adjacencyBonus?: IAdjacencyBonus = undefined;

    public static getVolcanicSpaces(player: Player, game: Game): Array<ISpace> {
      if (game.gameOptions.boardName === BoardName.ORIGINAL) {
        return game.board.getSpaces(SpaceType.LAND, player)
          .filter((space) => space.tile === undefined && (space.player === undefined || space.player === player))
          .filter((space) => space.id === SpaceName.THARSIS_THOLUS ||
                                   space.id === SpaceName.ASCRAEUS_MONS ||
                                   space.id === SpaceName.ARSIA_MONS ||
                                   space.id === SpaceName.PAVONIS_MONS);
      } else if (game.gameOptions.boardName === BoardName.ELYSIUM) {
        return game.board.getSpaces(SpaceType.LAND, player)
          .filter((space) => space.tile === undefined && (space.player === undefined || space.player === player))
          .filter((space) => space.id === SpaceName.HECATES_THOLUS ||
                               space.id === SpaceName.ELYSIUM_MONS ||
                               space.id === SpaceName.ARSIA_MONS_ELYSIUM ||
                               space.id === SpaceName.OLYMPUS_MONS);
      } else {
        return game.board.getSpaces(SpaceType.LAND, player)
          .filter((space) => space.tile === undefined && (space.player === undefined || space.player === player));
      }
    }
    public canPlay(player: Player, game: Game): boolean {
      const canPlaceTile = LavaFlows.getVolcanicSpaces(player, game).length > 0;
      const remainingTemperatureSteps = (MAX_TEMPERATURE - game.getTemperature()) / 2;
      const stepsRaised = Math.min(remainingTemperatureSteps, 2);

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * stepsRaised) && canPlaceTile;
      }

      return canPlaceTile;
    }
    public play(player: Player, game: Game) {
      return new SelectSpace('Select either Tharsis Tholus, Ascraeus Mons, Pavonis Mons or Arsia Mons', LavaFlows.getVolcanicSpaces(player, game), (space: ISpace) => {
        game.addTile(player, SpaceType.LAND, space, {tileType: TileType.LAVA_FLOWS});
        space.adjacency = this.adjacencyBonus;
        return game.increaseTemperature(player, 2);
      });
    }
    public metadata: CardMetadata = {
      cardNumber: '140',
      renderData: CardRenderer.builder((b) => {
        b.temperature(2).br;
        b.tile(TileType.LAVA_FLOWS, true, false).asterix();
      }),
      description: 'Raise temperature 2 steps and place this tile ON EITHER THARSIS THOLUS, ASCRAEUS MONS, PAVONIS MONS OR ARSIA MONS.',
    }
}
