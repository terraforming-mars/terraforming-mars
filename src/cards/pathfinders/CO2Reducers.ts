import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {Units} from '../../Units';

export class CO2Reducers extends PreludeCard {
  constructor() {
    super({
      name: CardName.CO2_REDUCERS,
      tags: [Tags.MICROBE, Tags.VENUS],
      productionBox: Units.of({megacredits: 3}),

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(3)).br;
          b.cards(2, {secondaryTag: Tags.MICROBE});
        }),
        description: 'Increase your M€ production 3 steps. Draw 2 cards with a microbe tag.',
      },
    });
  }
  public play(player: Player) {
    player.adjustProduction(this.productionBox);
    player.drawCard(2, {tag: Tags.MICROBE});
    return undefined;
  }
}

