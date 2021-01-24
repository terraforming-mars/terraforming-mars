import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {SpaceType} from '../../SpaceType';
import {Player} from '../../Player';
import {SpaceName} from '../../SpaceName';
import {TileType} from '../../TileType';
import {ISpace} from '../../boards/ISpace';
import {SelectSpace} from '../../inputs/SelectSpace';
import {BoardName} from '../../boards/BoardName';
import {CardName} from '../../CardName';
import {MAX_TEMPERATURE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class LavaFlows extends Card implements IProjectCard {
  constructor(
    name: CardName = CardName.LAVA_FLOWS,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
    metadata: CardMetadata = {
      cardNumber: '140',
      renderData: CardRenderer.builder((b) => {
        b.temperature(2).br;
        b.tile(TileType.LAVA_FLOWS, true, false).asterix();
      }),
      description: 'Raise temperature 2 steps and place this tile ON EITHER THARSIS THOLUS, ASCRAEUS MONS, PAVONIS MONS OR ARSIA MONS.',
    }) {
    super({
      cardType: CardType.EVENT,
      name,
      cost: 18,
      adjacencyBonus,
      metadata,
    });
  }

  public static getVolcanicSpaces(player: Player): Array<ISpace> {
    if (player.game.gameOptions.boardName === BoardName.ORIGINAL) {
      return player.game.board.getSpaces(SpaceType.LAND, player)
        .filter((space) => space.tile === undefined && (space.player === undefined || space.player === player))
        .filter((space) => space.id === SpaceName.THARSIS_THOLUS ||
                                   space.id === SpaceName.ASCRAEUS_MONS ||
                                   space.id === SpaceName.ARSIA_MONS ||
                                   space.id === SpaceName.PAVONIS_MONS);
    } else if (player.game.gameOptions.boardName === BoardName.ELYSIUM) {
      return player.game.board.getSpaces(SpaceType.LAND, player)
        .filter((space) => space.tile === undefined && (space.player === undefined || space.player === player))
        .filter((space) => space.id === SpaceName.HECATES_THOLUS ||
                               space.id === SpaceName.ELYSIUM_MONS ||
                               space.id === SpaceName.ARSIA_MONS_ELYSIUM ||
                               space.id === SpaceName.OLYMPUS_MONS);
    } else {
      return player.game.board.getSpaces(SpaceType.LAND, player)
        .filter((space) => space.tile === undefined && (space.player === undefined || space.player === player));
    }
  }
  public canPlay(player: Player): boolean {
    const canPlaceTile = LavaFlows.getVolcanicSpaces(player).length > 0;
    const remainingTemperatureSteps = (MAX_TEMPERATURE - player.game.getTemperature()) / 2;
    const stepsRaised = Math.min(remainingTemperatureSteps, 2);

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST * stepsRaised) && canPlaceTile;
    }

    return canPlaceTile;
  }
  public play(player: Player) {
    player.game.increaseTemperature(player, 2);
    return new SelectSpace('Select either Tharsis Tholus, Ascraeus Mons, Pavonis Mons or Arsia Mons', LavaFlows.getVolcanicSpaces(player), (space: ISpace) => {
      player.game.addTile(player, SpaceType.LAND, space, {tileType: TileType.LAVA_FLOWS});
      space.adjacency = this.adjacencyBonus;
      return undefined;
    });
  }
}
