import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Biolab extends PreludeCard {
  constructor() {
    super({
      name: CardName.BIOLAB,
      tags: [Tags.SCIENCE],

      metadata: {
        cardNumber: 'P04',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1)).br;
          b.cards(3);
        }),
        description: 'Increase your plant production 1 step. Draw 3 cards.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 1);
    player.drawCard(3);
    return undefined;
  }
}

