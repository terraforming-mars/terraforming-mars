import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class MiningQuota extends Card {
  constructor() {
    super({
      name: CardName.MINING_QUOTA,
      cardType: CardType.AUTOMATED,
      tags: [Tags.BUILDING],
      cost: 5,

      requirements: CardRequirements.builder((b) => b.tag(Tags.VENUS).tag(Tags.EARTH).tag(Tags.JOVIAN)),
      metadata: {
        cardNumber: '239',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.steel(2));
        }),
        description: 'Requires Venus, Earth and Jovian tags. Increase your steel production 2 steps.',
      },
    });
  };

  public canPlay(player: Player): boolean {
    return player.checkMultipleTagPresence([Tags.VENUS, Tags.EARTH, Tags.JOVIAN]);
  }

  public play(player: Player) {
    player.addProduction(Resources.STEEL, 2);
    return undefined;
  }
}
