import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';

export class GlobalAudit extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.GLOBAL_AUDIT,
      type: CardType.EVENT,
      cost: 2,
      tags: [Tag.EARTH],

      metadata: {
        cardNumber: 'U25',
        renderData: CardRenderer.builder((b) => {
          b.text('0').corruption(1).colon().tr(1);
        }),
        description: 'Every player with 0 corruption gains 1 TR, if possible.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    for (const p of player.game.getPlayers()) {
      if (p.underworldData.corruption === 0 && player.canAfford({cost: 0, tr: {tr: 1}})) {
        p.increaseTerraformRating(1, {log: true});
      }
    }
    return undefined;
  }
}
