import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class VenusFirst extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.VENUS_FIRST,
      tags: [Tag.VENUS],
      metadata: {
        cardNumber: 'Y07',
        renderData: CardRenderer.builder((b) => {
          b.venus(2).br.br;
          b.cards(2, {secondaryTag: Tag.VENUS});
        }),
        description: 'Raise Venus 2 steps. Draw 2 Venus cards from the deck.',
      },
    });
  }

  public play(player: Player) {
    player.game.increaseVenusScaleLevel(player, 2);
    player.drawCard(2, {tag: Tag.VENUS});
    return undefined;
  }
}

