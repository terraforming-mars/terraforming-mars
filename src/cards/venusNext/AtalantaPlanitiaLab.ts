import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class AtalantaPlanitiaLab extends Card {
  constructor() {
    super({
      name: CardName.ATALANTA_PLANITIA_LAB,
      cardType: CardType.AUTOMATED,
      tags: [Tags.VENUS, Tags.SCIENCE],
      cost: 10,

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 3)),
      victoryPoints: 2,

      metadata: {
        cardNumber: '216',
        description: 'Requires 3 science tags. Draw 2 cards.',
        renderData: CardRenderer.builder((b) => b.cards(2)),
      },
    });
  };

  public play(player: Player) {
    player.drawCard(2);
    return undefined;
  }
}
