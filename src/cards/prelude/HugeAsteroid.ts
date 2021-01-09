import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../CardName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class HugeAsteroid extends PreludeCard {
    public tags = [];
    public name = CardName.HUGE_ASTEROID;
    public canPlay(player: Player, _game: Game) {
      return player.canAfford(5);
    }
    public play(player: Player, game: Game) {
      game.increaseTemperature(player, 3);
      game.defer(new SelectHowToPayDeferred(player, 5));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P15',
      renderData: CardRenderer.builder((b) => {
        b.temperature(3).br;
        b.megacredits(-5);
      }),
      description: 'Increase Temperature 3 steps. Pay 5 MC.',
    }
}
