import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../../common/Units';

export class MetalsCompany extends PreludeCard implements IProjectCard {
  public migrated = true;
  constructor() {
    super({
      name: CardName.METALS_COMPANY,

      productionBox: Units.of({megacredits: 1, steel: 1, titanium: 1}),
      metadata: {
        cardNumber: 'P20',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1).steel(1).titanium(1));
        }),
        description: 'Increase your M€, steel and titanium production 1 step.',
      },
    });
  }
  public play() {
    return undefined;
  }
}
