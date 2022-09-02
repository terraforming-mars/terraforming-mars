import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SmeltingPlant extends PreludeCard {
  constructor() {
    super({
      name: CardName.SMELTING_PLANT,
      tags: [Tag.BUILDING],

      metadata: {
        cardNumber: 'P30',
        renderData: CardRenderer.builder((b) => {
          b.oxygen(2).br;
          b.steel(5);
        }),
        description: 'Raise oxygen 2 steps. Gain 5 steel.',
      },
    });
  }
  public play(player: Player) {
    player.steel += 5;
    return player.game.increaseOxygenLevel(player, 2);
  }
}
