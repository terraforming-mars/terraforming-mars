import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class VenusFirst extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.VENUS_FIRST,
      tags: [Tags.VENUS],
      metadata: {
        cardNumber: 'Y07',
        renderData: CardRenderer.builder((b) => {
          b.venus(2).br.br;
          b.cards(2, {secondaryTag: Tags.VENUS});
        }),
        description: 'Raise Venus 2 steps. Draw 2 Venus cards from the deck.',
      },
    });
  }

  public play(player: Player) {
    player.game.increaseVenusScaleLevel(player, 2);
    player.drawCard(2, {tag: Tags.VENUS});
    return undefined;
  }
}

