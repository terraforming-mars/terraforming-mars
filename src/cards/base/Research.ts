import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Research extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.RESEARCH,
      tags: [Tags.SCIENCE, Tags.SCIENCE],
      cost: 11,
      victoryPoints: 1,

      metadata: {
        cardNumber: '090',
        renderData: CardRenderer.builder((b) => {
          b.cards(2);
        }),
        description: 'Counts as playing 2 science cards. Draw 2 cards.',
      },
    });
  }

  public play(player: Player) {
    player.drawCard(2);
    return undefined;
  }
}
