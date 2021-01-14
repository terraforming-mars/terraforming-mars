import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Research extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.RESEARCH,
      tags: [Tags.SCIENCE, Tags.SCIENCE],
      cost: 11,

      metadata: {
        cardNumber: '090',
        renderData: CardRenderer.builder((b) => {
          b.cards(2);
        }),
        description: 'Counts as playing 2 science cards. Draw 2 cards.',
        victoryPoints: 1,
      },
    });
  }

  public play(player: Player) {
    player.drawCard(2);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
