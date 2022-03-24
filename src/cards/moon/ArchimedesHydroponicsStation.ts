import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';
import {MoonCard} from './MoonCard';

export class ArchimedesHydroponicsStation extends MoonCard {
  constructor() {
    super({
      name: CardName.ARCHIMEDES_HYDROPONICS_STATION,
      cardType: CardType.AUTOMATED,
      tags: [Tags.PLANT],
      cost: 12,
      productionBox: Units.of({energy: -1, megacredits: -1, plants: 2}),

      metadata: {
        description: 'Decrease your energy production 1 step and your M€ production 1 step. Increase your plant production 2 steps.',
        cardNumber: 'M27',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().energy(1).megacredits(1));
          b.br;
          b.production((pb) => pb.plants(2));
        }),
      },
    }, {
      // No moon card properties.
    });
  }

  public override play(player: Player) {
    player.adjustProduction(this.productionBox, {log: true});
    return undefined;
  }
}
