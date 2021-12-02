import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {Units} from '../../Units';

export class AntidesertificationTechniques extends PreludeCard {
  constructor() {
    super({
      name: CardName.ANTI_DESERTIFICATION_TECHNIQUES,
      productionBox: Units.of({plants: 1, steel: 1}),
      startingMegacredits: 5,

      metadata: {
        cardNumber: 'P08',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(5).br;
          b.production((pb) => pb.plants(1).steel(1));
        }),
        description: 'Gain 5 M€. Increase your plant production 1 step and your steel production 1 step.',
      },
    });
  }
  public play(player: Player) {
    player.adjustProduction(this.productionBox, {log: true});
    player.addResource(Resources.MEGACREDITS, 5);
    return undefined;
  }
}

