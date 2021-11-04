import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class Solarnet extends Card {
  constructor() {
    super({
      name: CardName.SOLARNET,
      cardType: CardType.AUTOMATED,
      cost: 7,

      requirements: CardRequirements.builder((b) => b.tag(Tags.VENUS).tag(Tags.EARTH).tag(Tags.JOVIAN)),
      victoryPoints: 1,

      metadata: {
        cardNumber: '245',
        renderData: CardRenderer.builder((b) => {
          b.cards(2);
        }),
        description: 'Requires Venus, Earth and Jovian tags. Draw 2 cards.',
      },
    });
  };

  public play(player: Player) {
    player.drawCard(2);
    return undefined;
  }
}
