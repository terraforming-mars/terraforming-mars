import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';

export class MiningRobotsManufCenter extends MoonCard {
  constructor() {
    super({
      name: CardName.MINING_ROBOTS_MANUF_CENTER,
      cardType: CardType.AUTOMATED,
      tags: [Tags.SCIENCE, Tags.BUILDING],
      cost: 12,
      reserveUnits: Units.of({titanium: 1}),
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

  public override play(player: Player) {
    super.play(player);
    MoonExpansion.raiseMiningRate(player, 2);
    return undefined;
  }
}
