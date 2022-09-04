import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class MiningRobotsManufCenter extends Card {
  constructor() {
    super({
      name: CardName.MINING_ROBOTS_MANUF_CENTER,
      cardType: CardType.AUTOMATED,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 12,
      reserveUnits: {titanium: 1},
      tr: {moonMining: 2},

      metadata: {
        description: 'Spend 1 titanium. Raise the Mining Rate 2 steps.',
        cardNumber: 'M23',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).br;
          b.moonMiningRate({amount: 2});
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    MoonExpansion.raiseMiningRate(player, 2);
    return undefined;
  }
}
