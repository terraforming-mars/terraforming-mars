import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class Worms extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.WORMS,
      tags: [Tag.MICROBE],
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
    player.production.add(Resources.PLANTS, Math.floor((player.tags.count(Tag.MICROBE) + 1) / 2), {log: true});
    return undefined;
  }
}
