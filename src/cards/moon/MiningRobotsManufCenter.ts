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
      productionDelta: Units.of({}),

      metadata: {
        description: 'Spend 1 titanium. Raise Mining Rate 2 steps.',
        cardNumber: 'M23',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).br;
          b.moonMineRate(2);
        }),
      },
    }, {
      reserveUnits: Units.of({titanium: 1}),
    });
  }

  public play(player: Player) {
    Units.deductUnits(this.reserveUnits, player);
    MoonExpansion.raiseMiningRate(player);
    MoonExpansion.raiseMiningRate(player);
    return undefined;
  }
}
