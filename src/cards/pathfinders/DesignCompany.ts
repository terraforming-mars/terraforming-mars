import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';

export class DesignCompany extends PreludeCard {
  constructor() {
    super({
      name: CardName.DESIGN_COMPANY,
      tags: [Tags.MARS],

      metadata: {
        cardNumber: 'P08',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.steel(1)).br;
          b.cards(3, {secondaryTag: Tags.BUILDING});
        }),
        description: 'Increase your steel production 1 step. Draw 3 cards with a building tag.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.STEEL, 1);
    player.drawCard(3, {tag: Tags.BUILDING});
    return undefined;
  }
}

