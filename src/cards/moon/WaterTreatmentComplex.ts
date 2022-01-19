import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';
import {CardRequirements} from '../CardRequirements';
import {all} from '../Options';

export class WaterTreatmentComplex extends MoonCard {
  constructor() {
    super({
      name: CardName.WATER_TREATMENT_COMPLEX,
      cardType: CardType.AUTOMATED,
      cost: 12,
      requirements: CardRequirements.builder((b) => b.colonyTiles(1, {all})),
      reserveUnits: Units.of({titanium: 1}),
      tr: {moonColony: 2},

      metadata: {
        description: 'Requires 1 colony tile on the Moon. Spend 1 titanium. Raise the Colony Rate 2 steps.',
        cardNumber: 'M46',
        // requirements: CardRequirements.builder((b) => b.text('1 colony on Moon')),// TODO(kberg):
        renderData: CardRenderer.builder((b) => b.minus().titanium(1).br.moonColonyRate({amount: 2})),
      },
    });
  };

  public override play(player: Player) {
    super.play(player);
    MoonExpansion.raiseColonyRate(player, 2);
    return undefined;
  }
}
