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
import {CardMetadata} from '../cards/CardMetadata';
import {CardRenderer} from '../cards/render/CardRenderer';

export class BigAsteroid implements IProjectCard {
  public cost = 27;
  public tags = [Tags.SPACE];
  public cardType = CardType.EVENT;
  public name = CardName.BIG_ASTEROID;
  public hasRequirements = false;

  public canPlay(player: Player, game: Game): boolean {
    const remainingTemperatureSteps = (MAX_TEMPERATURE - game.getTemperature()) / 2;
    const stepsRaised = Math.min(remainingTemperatureSteps, 2);

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * stepsRaised, game, false, true);
    }

    return true;
  }

  public play(player: Player, game: Game) {
    game.increaseTemperature(player, 2);
    game.defer(new RemoveAnyPlants(player, game, 4));
    player.titanium += 4;
    return undefined;
  }

  public metadata: CardMetadata = {
    description: 'Raise temperature 2 steps and gain 4 titanium. Remove up to 4 Plants from any player.',
    cardNumber: '011',
    renderData: CardRenderer.builder((b) => {
      b.temperature(2).br;
      b.titanium(4).br;
      b.minus().plants(-4).any;
    }),
  };
}
