import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
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

export class NuclearZone implements IProjectCard {
    public cost = 10;
    public tags = [Tags.EARTH];
    public name = CardName.NUCLEAR_ZONE;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public adjacencyBonus?: IAdjacencyBonus = undefined;

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
      return new SelectSpace('Select space for special tile', game.board.getAvailableSpacesOnLand(player), (foundSpace: ISpace) => {
        game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.NUCLEAR_ZONE});
        foundSpace.adjacency = this.adjacencyBonus;
        return game.increaseTemperature(player, 2);
      });
    }

    public getVictoryPoints() {
      return -2;
    }

    public metadata: CardMetadata = {
      cardNumber: '097',
      renderData: CardRenderer.builder((b) => {
        b.tile(TileType.NUCLEAR_ZONE, true).br;
        b.temperature(2);
      }),
      description: 'Place this tile and raise temperature 2 steps.',
      victoryPoints: -2,
    }
}
