import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';

export class VenusFirst extends PreludeCard {
  constructor() {
    super({
      name: CardName.VENUS_FIRST_PATHFINDERS,
      tags: [Tags.VENUS],
      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.venus(2).br.br;
          b.cards(2, {secondaryTag: Tags.VENUS});
        }),
        description: 'Raise Venus 2 steps. Draw 2 Venus cards.',
      },
    });
  }

  public play(player: Player) {
    player.game.increaseVenusScaleLevel(player, 2);
    player.drawCard(2, {tag: Tags.VENUS});
    return undefined;
  }
}
