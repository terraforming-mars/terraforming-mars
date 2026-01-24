import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class NitrogenRichAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.NITROGEN_RICH_ASTEROID,
      tags: [Tag.SPACE],
      cost: 31,

      behavior: {
        global: {temperature: 1},
        tr: 2,
      },

      metadata: {
        cardNumber: '037',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.plants(1).nbsp.or().br;
            pb.tag(Tag.PLANT, {amount: 3, digit}).colon().nbsp.plants(4, {digit});
          }).br;
          b.tr(2).temperature(1);
        }),
        description: 'Raise your terraforming rating 2 steps and temperature 1 step. Increase your plant production 1 step, or 4 steps if you have 3 plant tags.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    if (player.tags.count(Tag.PLANT) < 3) {
      player.production.add(Resource.PLANTS, 1, {log: true});
    } else {
      player.production.add(Resource.PLANTS, 4, {log: true});
    }
    return undefined;
  }
}
