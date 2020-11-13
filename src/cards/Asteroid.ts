import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {CardName} from '../CardName';
import {MAX_TEMPERATURE, REDS_RULING_POLICY_COST} from '../constants';
import {PartyHooks} from '../turmoil/parties/PartyHooks';
import {PartyName} from '../turmoil/parties/PartyName';
import {RemoveAnyPlants} from '../deferredActions/RemoveAnyPlants';

export class Asteroid implements IProjectCard {
  public cost = 14;
  public tags = [Tags.SPACE];
  public name = CardName.ASTEROID;
  public cardType = CardType.EVENT;
  public hasRequirements = false;

  public canPlay(player: Player, game: Game): boolean {
    const temperatureMaxed = game.getVenusScaleLevel() === MAX_TEMPERATURE;
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !temperatureMaxed) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, true);
    }

    return true;
  }

  public play(player: Player, game: Game) {
    game.increaseTemperature(player, 1);
    game.defer(new RemoveAnyPlants(player, game, 3));
    player.titanium += 2;
    return undefined;
  }
}
