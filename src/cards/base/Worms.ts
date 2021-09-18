import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class Worms extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.WORMS,
      tags: [Tags.MICROBE],
      cost: 8,

      requirements: CardRequirements.builder((b) => b.oxygen(4)),
      metadata: {
        cardNumber: '129',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1).slash().microbes(2, {played}));
        }),
        description: 'Requires 4% oxygen. Increase your Plant production 1 step for every 2 Microbe tags you have, including this.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.PLANTS, Math.floor((player.getTagCount(Tags.MICROBE) + 1) / 2), {log: true});
    return undefined;
  }
}
