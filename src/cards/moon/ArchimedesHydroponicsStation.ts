import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
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
        description: 'Decrease your energy production 1 step and your MC production 1 step. Increase your plant production 2 steps.',
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
  };

  public play(player: Player) {
    player.adjustProduction(this.productionBox, player.game);
    return undefined;
  }
}
