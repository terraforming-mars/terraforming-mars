import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class MetalRichAsteroid extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.METAL_RICH_ASTEROID,
      metadata: {
        cardNumber: 'P19',
        renderData: CardRenderer.builder((b) => {
          b.temperature(1).titanium(4).br;
          b.steel(4);
        }),
        description: 'Increase temperature 1 step. Gain 4 titanium and 4 steel.',
      },
    });
  }
  public play(player: Player) {
    player.titanium += 4;
    player.steel += 4;
    return player.game.increaseTemperature(player, 1);
  }
}

