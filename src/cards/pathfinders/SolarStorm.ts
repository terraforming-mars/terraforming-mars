import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../common/Resources';
import {Tags} from '../Tags';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {ResourceType} from '../../common/ResourceType';
import {all, digit} from '../Options';

export class SolarStorm extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.SOLAR_STORM,
      cost: 12,
      tags: [Tags.SPACE],
      tr: {temperature: 1},

      metadata: {
        cardNumber: 'Pf32',
        renderData: CardRenderer.builder((b) => {
          b.minus().plants(2, {all}).asterix().nbsp.minus().data({amount: 3, digit, all}).br;
          b.production((pb) => pb.heat(1)).nbsp.temperature(1);
        }),
        description: 'Every player loses 2 plants. Remove up to 3 data from any player. ' +
          'Raise your heat production 1 step. Raise the temperature 1 step.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.HEAT, 1);
    player.game.getPlayers().forEach((p) => {
      if (!p.plantsAreProtected()) {
        p.deductResource(Resources.PLANTS, 2, {log: true, from: player});
      }
    });
    player.game.defer(new RemoveResourcesFromCard(player, ResourceType.DATA, 3));
    player.game.increaseTemperature(player, 1);
    return undefined;
  }
}

