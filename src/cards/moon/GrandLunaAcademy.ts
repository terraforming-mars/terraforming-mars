import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {digit, played} from '../Options';

export class GrandLunaAcademy extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.GRAND_LUNA_ACADEMY,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON],
      cost: 13,

      metadata: {
        description: 'Draw 1 card per 2 Moon tags you have, including this.',
        cardNumber: 'M83',
        renderData: CardRenderer.builder((b) => {
          b.cards(1).slash().moon(2, {digit, played});
        }),
      },
    });
  }

  public play(player: Player) {
    const tags = player.getTagCount(Tags.MOON);
    // Adding 1 so this tag is included in the count.
    const gain = Math.floor((tags + 1) / 2);
    player.drawCard(gain);
    return undefined;
  }
}
