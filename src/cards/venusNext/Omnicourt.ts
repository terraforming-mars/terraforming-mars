import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class Omnicourt extends Card {
  constructor() {
    super({
      name: CardName.OMNICOURT,
      cardType: CardType.AUTOMATED,
      tags: [Tags.BUILDING],
      cost: 11,
      tr: {tr: 2},

      requirements: CardRequirements.builder((b) => b.tag(Tags.VENUS).tag(Tags.EARTH).tag(Tags.JOVIAN)),
      metadata: {
        cardNumber: '241',
        renderData: CardRenderer.builder((b) => {
          b.tr(2);
        }),
        description: 'Requires Venus, Earth and Jovian tags. Increase your TR 2 steps.',
      },
    });
  };

  public play(player: Player) {
    player.increaseTerraformRatingSteps(2);
    return undefined;
  }
}
