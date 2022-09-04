import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {digit, played} from '../Options';
import {IProjectCard} from '../IProjectCard';

export class IoSulphurResearch extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.IO_SULPHUR_RESEARCH,
      cardType: CardType.AUTOMATED,
      tags: [Tag.SCIENCE, Tag.JOVIAN],
      cost: 17,

      victoryPoints: 2,

      metadata: {
        cardNumber: '232',
        renderData: CardRenderer.builder((b) => {
          b.cards(1).br;
          b.or().br;
          b.venus(3, {played, digit}).colon().cards(3);
        }),
        description: 'Draw 1 card, or draw 3 if you have at least 3 Venus tags.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.drawCard(player.tags.count(Tag.VENUS) >= 3 ? 3 : 1);
    return undefined;
  }
}
