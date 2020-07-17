import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {ISpace} from '../ISpace';
import {SelectSpace} from '../inputs/SelectSpace';
import {SpaceType} from '../SpaceType';
import { CardName } from '../CardName';
import { PartyHooks } from '../turmoil/parties/PartyHooks';
import { PartyName } from '../turmoil/parties/PartyName';
import { MAX_OCEAN_TILES, REDS_RULING_POLICY_COST } from '../constants';

export class ArtificialLake implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.ARTIFICIAL_LAKE;
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      const meetsTemperatureRequirements = game.getTemperature() >= -6 - (player.getRequirementsBonus(game) * 2);
      const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oceansMaxed) {
        return player.canAfford(this.cost + REDS_RULING_POLICY_COST, game, true) && meetsTemperatureRequirements;
      }

      return meetsTemperatureRequirements;
    }
    public play(player: Player, game: Game) {
      if (game.board.getOceansOnBoard() >= MAX_OCEAN_TILES) return undefined;

      return new SelectSpace(
          'Select a land space to place an ocean',
          game.board.getAvailableSpacesOnLand(player),
          (foundSpace: ISpace) => {
            game.addOceanTile(player, foundSpace.id, SpaceType.LAND);
            return undefined;
          }
      );
    }
    public getVictoryPoints() {
      return 1;
    }
}
