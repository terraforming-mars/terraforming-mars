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

export class DeimosDown implements IProjectCard {
    public cost: number = 31;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.DEIMOS_DOWN;
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game) {
      const remainingTemperatureSteps = (MAX_TEMPERATURE - game.getTemperature()) / 2;
      const stepsRaised = Math.min(remainingTemperatureSteps, 3);

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(this.cost + REDS_RULING_POLICY_COST * stepsRaised, game, false, true);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.increaseTemperature(player, 3);
      game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 8);
      player.steel += 4;
      return undefined;
    }
}
