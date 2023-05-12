import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {Resource} from '../../../common/Resource';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class CommunityServices extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 13,
      name: CardName.COMMUNITY_SERVICES,
      type: CardType.AUTOMATED,
      victoryPoints: 1,

      metadata: {
        cardNumber: 'C04',
        description: 'Increase your M€ production 1 step per CARD WITH NO TAGS, including this.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1);
          }).slash().noTags();
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.production.add(Resource.MEGACREDITS, player.getNoTagsCount() + 1, {log: true});
    return undefined;
  }
}
