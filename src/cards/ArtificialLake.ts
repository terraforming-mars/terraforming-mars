import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {ISpace} from '../ISpace';
import {SelectSpace} from '../inputs/SelectSpace';
import {SpaceType} from '../SpaceType';
import {CardName} from '../CardName';
import {PartyHooks} from '../turmoil/parties/PartyHooks';
import {PartyName} from '../turmoil/parties/PartyName';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../constants';
import {CardMetadata} from '../cards/CardMetadata';
import {CardRequirements} from '../cards/CardRequirements';
import {CardRenderer} from '../cards/render/CardRenderer';

export class ArtificialLake implements IProjectCard {
  public cost = 15;
  public tags = [Tags.STEEL];
  public name = CardName.ARTIFICIAL_LAKE;
  public cardType = CardType.AUTOMATED;
  public canPlay(player: Player, game: Game): boolean {
    const meetsTemperatureRequirements = game.getTemperature() >= -6 - player.getRequirementsBonus(game) * 2;
    const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oceansMaxed) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, true) && meetsTemperatureRequirements;
    }

    return meetsTemperatureRequirements;
  }
  public play(player: Player, game: Game) {
    if (game.board.getOceansOnBoard() >= MAX_OCEAN_TILES) return undefined;

    return new SelectSpace('Select a land space to place an ocean', game.board.getAvailableSpacesOnLand(player), (foundSpace: ISpace) => {
      game.addOceanTile(player, foundSpace.id, SpaceType.LAND);
      return undefined;
    });
  }
  public getVictoryPoints() {
    return 1;
  }

  public metadata: CardMetadata = {
    description: 'Requires -6 C or warmer. Place 1 ocean tile ON AN AREA NOT RESERVED FOR OCEAN',
    cardNumber: '116',
    requirements: CardRequirements.builder((b) => b.temperature(-6)),
    renderData: CardRenderer.builder((b) => b.oceans(1).asterix()),
    victoryPoints: 1,
  };
}
