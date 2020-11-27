import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {MAX_TEMPERATURE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class DeimosDown implements IProjectCard {
    public cost = 31;
    public tags = [Tags.SPACE];
    public name = CardName.DEIMOS_DOWN;
    public cardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
      const remainingTemperatureSteps = (MAX_TEMPERATURE - game.getTemperature()) / 2;
      const stepsRaised = Math.min(remainingTemperatureSteps, 3);

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * stepsRaised, game, false, true);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.increaseTemperature(player, 3);
      game.defer(new RemoveAnyPlants(player, game, 8));
      player.steel += 4;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '039',
      description: 'Raise temperature 3 steps and gain 4 steel. Remove up to 8 Plants from any player',
      renderData: CardRenderer.builder((b) => {
        b.temperature(3).br;
        b.steel(4).br;
        b.minus().plants(-8).any;
      }),
    }
}
