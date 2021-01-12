import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SmeltingPlant extends PreludeCard {
  constructor() {
    super({
      name: CardName.SMELTING_PLANT,
      tags: [Tags.BUILDING],

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
  public play(player: Player, game: Game) {
    player.steel += 5;
    return game.increaseOxygenLevel(player, 2);
  }
}
