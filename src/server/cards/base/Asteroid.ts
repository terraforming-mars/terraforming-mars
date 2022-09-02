import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Asteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.ASTEROID,
      tags: [Tag.SPACE],
      cost: 14,
      tr: {temperature: 1},

      metadata: {
        description: 'Raise temperature 1 step and gain 2 titanium. Remove up to 3 Plants from any player.',
        cardNumber: '009',
        renderData: CardRenderer.builder((b) => {
          b.temperature(1).br;
          b.titanium(2).br;
          b.minus().plants(-3, {all});
        }),
      },
    });
  }

  public play(player: Player) {
    player.game.increaseTemperature(player, 1);
    player.game.defer(new RemoveAnyPlants(player, 3));
    player.titanium += 2;
    return undefined;
  }
}
