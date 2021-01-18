import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST, MAX_TEMPERATURE} from '../../constants';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SmallAsteroid implements IProjectCard {
    public cost = 10;
    public name = CardName.SMALL_ASTEROID;
    public tags = [Tags.SPACE];
    public cardType = CardType.EVENT;

    public canPlay(player: Player, game: Game): boolean {
      const canRaiseTemperature = game.getTemperature() < MAX_TEMPERATURE;
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && canRaiseTemperature) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, true);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.increaseTemperature(player, 1);
      game.defer(new RemoveAnyPlants(player, 2));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '209',
      renderData: CardRenderer.builder((b) => {
        b.temperature(1).br;
        b.minus().plants(2).any;
      }),
      description: 'Increase temperature 1 step. Remove up to 2 plants from any player.',
    }
}
