import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { Resources } from '../Resources';
import { CardName } from '../CardName';
import { MAX_TEMPERATURE, REDS_RULING_POLICY_COST } from '../constants';
import { PartyHooks } from '../turmoil/parties/PartyHooks';
import { PartyName } from '../turmoil/parties/PartyName';

export class Asteroid implements IProjectCard {
    public cost: number = 14;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.ASTEROID;
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game) {
      const temperatureMaxed = game.getVenusScaleLevel() === MAX_TEMPERATURE;
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !temperatureMaxed) {
        return player.canAfford(this.cost + REDS_RULING_POLICY_COST, game, false, true);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.increaseTemperature(player, 1);
      game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 3);
      player.titanium += 2;
      return undefined;
    }
}
