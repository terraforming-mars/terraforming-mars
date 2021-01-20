import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class IoSulphurResearch extends Card {
  constructor() {
    super({
      name: CardName.IO_SULPHUR_RESEARCH,
      cardType: CardType.AUTOMATED,
      tags: [Tags.SCIENCE, Tags.JOVIAN],
      cost: 17,

      metadata: {
        cardNumber: '232',
        renderData: CardRenderer.builder((b) => {
          b.cards(1).br;
          b.or().br;
          b.venus(3).played.digit.colon().cards(3);
        }),
        description: 'Draw 1 card, or draw 3 if you have at least 3 Venus tags.',
        victoryPoints: 2,
      },
    });
  };

  public play(player: Player) {
    player.drawCard(player.getTagCount(Tags.VENUS) >= 3 ? 3 : 1);
    return undefined;
  }
  public getVictoryPoints() {
    return 2;
  }
}
