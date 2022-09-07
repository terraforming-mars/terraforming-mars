import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../../common/Resources';

export class AntidesertificationTechniques extends PreludeCard {
  constructor() {
    super({
      name: CardName.ANTI_DESERTIFICATION_TECHNIQUES,

      behavior: {
        production: {plants: 1, steel: 1},
      },
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
  public override bespokePlay(player: Player) {
    player.addResource(Resources.MEGACREDITS, 5);
    return undefined;
  }
}

