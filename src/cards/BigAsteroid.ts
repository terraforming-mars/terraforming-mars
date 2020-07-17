import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { CardName } from '../CardName';
import { Resources } from '../Resources';
import { MAX_TEMPERATURE, REDS_RULING_POLICY_COST } from '../constants';
import { PartyHooks } from '../turmoil/parties/PartyHooks';
import { PartyName } from '../turmoil/parties/PartyName';

export class BigAsteroid implements IProjectCard {
    public cost: number = 27;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.BIG_ASTEROID;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game) {
      const remainingTemperatureSteps = (MAX_TEMPERATURE - game.getTemperature()) / 2;
      const stepsRaised = Math.min(remainingTemperatureSteps, 2);

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(this.cost + REDS_RULING_POLICY_COST * stepsRaised, game, false, true);
    }

      return true;
    }

    public play(player: Player, game: Game) {
      game.increaseTemperature(player, 2);
      game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 4);
      player.titanium += 4;
      return undefined;
    }
}
