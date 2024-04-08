import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {CardResource} from '../../../common/CardResource';
import {all, digit} from '../Options';

export class SolarStorm extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.SOLAR_STORM,
      cost: 12,
      tags: [Tag.SPACE],

      behavior: {
        production: {heat: 1},
        global: {temperature: 1},
      },

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

  public override bespokePlay(player: IPlayer) {
    for (const p of player.game.getPlayers()) {
      if (!p.plantsAreProtected()) {
        // Botanical Experience reduces the impact in half.
        if (p.cardIsInEffect(CardName.BOTANICAL_EXPERIENCE)) {
          p.stock.deduct(Resource.PLANTS, 1, {log: true, from: player});
        } else {
          p.stock.deduct(Resource.PLANTS, 2, {log: true, from: player});
        }
      }
    }
    player.game.defer(new RemoveResourcesFromCard(
      player, CardResource.DATA, 3, {mandatory: false}));
    return undefined;
  }
}

