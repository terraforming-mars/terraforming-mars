import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {Units} from '../../../common/Units';

export class CO2Reducers extends PreludeCard {
  constructor() {
    super({
      name: CardName.CO2_REDUCERS,
      tags: [Tag.MICROBE, Tag.VENUS],
      productionBox: Units.of({megacredits: 3}),

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(3)).br;
          b.cards(2, {secondaryTag: Tag.MICROBE});
        }),
        description: 'Increase your M€ production 3 steps. Draw 2 cards with a microbe tag.',
      },
    });
  }
  public play(player: Player) {
    player.adjustProduction(this.productionBox);
    player.drawCard(2, {tag: Tag.MICROBE});
    return undefined;
  }
}

