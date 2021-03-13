import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';

export class LunaResort extends MoonCard {
  constructor() {
    super({
      name: CardName.LUNA_RESORT,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON],
      cost: 11,
      productionBox: Units.of({energy: -1, megacredits: 3}),

      requirements: CardRequirements.builder((b) => b.colonyTiles(2).any()),
      metadata: {
        description:
          'Requires 2 colonies on the Moon. Spend 2 titanium. Decrease your energy production 1 step and increase your MC production 3 steps. Raise the Colony Rate 1 step.',
        cardNumber: 'M21',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).production((pb) => {
            pb.minus().energy(1).nbsp.megacredits(3);
          }).br;
          b.moonColonyRate();
        }),
      },
    }, {
      reserveUnits: Units.of({titanium: 2}),
    });
  };

  public play(player: Player) {
    super.play(player);
    MoonExpansion.raiseColonyRate(player);
    return undefined;
  }
}
