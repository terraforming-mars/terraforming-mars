import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class DeimosDown extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.DEIMOS_DOWN,
      tags: [Tags.SPACE],
      cost: 31,
      tr: {temperature: 3},

      metadata: {
        cardNumber: '039',
        description: 'Raise temperature 3 steps and gain 4 steel. Remove up to 8 Plants from any player.',
        renderData: CardRenderer.builder((b) => {
          b.temperature(3).br;
          b.steel(4).br;
          b.minus().plants(-8, {all});
        }),
      },
    });
  }

  public play(player: Player) {
    player.game.increaseTemperature(player, 3);
    player.game.defer(new RemoveAnyPlants(player, 8));
    player.steel += 4;
    return undefined;
  }
}
