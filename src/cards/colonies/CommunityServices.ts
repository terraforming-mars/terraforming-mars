import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class CommunityServices extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 13,
      name: CardName.COMMUNITY_SERVICES,
      cardType: CardType.AUTOMATED,

      metadata: {
        cardNumber: 'C04',
        description: 'Increase your M€ production 1 step per CARD WITH NO TAGS, including this.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1);
          }).slash().noTags();
        }),
        victoryPoints: 1,
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, player.getNoTagsCount() + 1);
    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }
}
