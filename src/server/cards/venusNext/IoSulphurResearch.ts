import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {digit} from '../Options';
import {IProjectCard} from '../IProjectCard';

export class IoSulphurResearch extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.IO_SULPHUR_RESEARCH,
      type: CardType.AUTOMATED,
      tags: [Tag.SCIENCE, Tag.JOVIAN],
      cost: 17,

      victoryPoints: 2,

      metadata: {
        cardNumber: '232',
        renderData: CardRenderer.builder((b) => {
          b.cards(1).br;
          b.or().br;
          b.tag(Tag.VENUS, {amount: 3, digit}).colon().cards(3);
        }),
        description: 'Draw 1 card, or draw 3 if you have at least 3 Venus tags.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.drawCard(player.tags.count(Tag.VENUS) >= 3 ? 3 : 1);
    return undefined;
  }
}
