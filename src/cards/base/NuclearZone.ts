import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../TileType';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';
import {MAX_TEMPERATURE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class NuclearZone extends Card implements IProjectCard {
  constructor(
    name: CardName = CardName.NUCLEAR_ZONE,
    cost: number = 10,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
    metadata: CardMetadata = {
      cardNumber: '097',
      renderData: CardRenderer.builder((b) => {
        b.tile(TileType.NUCLEAR_ZONE, true).br;
        b.temperature(2);
      }),
      description: 'Place this tile and raise temperature 2 steps.',
      victoryPoints: -2,
    }) {
    super({
      cardType: CardType.AUTOMATED,
      name,
      tags: [Tags.EARTH],
      cost,
      hasRequirements: false,
      adjacencyBonus,
      metadata,
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    const canPlaceTile = game.board.getAvailableSpacesOnLand(player).length > 0;
    const remainingTemperatureSteps = (MAX_TEMPERATURE - game.getTemperature()) / 2;
    const stepsRaised = Math.min(remainingTemperatureSteps, 2);

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * stepsRaised) && canPlaceTile;
    }

    return canPlaceTile;
  }

  public play(player: Player, game: Game) {
    game.increaseTemperature(player, 2);
    return new SelectSpace('Select space for special tile', game.board.getAvailableSpacesOnLand(player), (foundSpace: ISpace) => {
      game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.NUCLEAR_ZONE});
      foundSpace.adjacency = this.adjacencyBonus;
      return undefined;
    });
  }

  public getVictoryPoints() {
    return -2;
  }
}
