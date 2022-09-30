import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit, played} from '../Options';

export class NitrogenRichAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
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
            pb.plants(3, {played, digit}).colon().nbsp.plants(4, {digit});
          }).br;
          b.tr(2).temperature(1);
        }),
        description: 'Raise your terraforming rating 2 steps and temperature 1 step. Increase your plant production 1 step, or 4 steps if you have 3 Plant tags.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    if (player.tags.count(Tag.PLANT) < 3) {
      player.production.add(Resources.PLANTS, 1, {log: true});
    } else {
      player.production.add(Resources.PLANTS, 4, {log: true});
    }
    return undefined;
  }
}
