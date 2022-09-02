import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../../common/Resources';
import {Tag} from '../../../common/cards/Tag';
import {played} from '../Options';

export class ExpeditionToTheSurfaceVenus extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.EXPEDITION_TO_THE_SURFACE_VENUS,
      cost: 16,
      tags: [Tag.VENUS],
      tr: {venus: 1},

      metadata: {
        cardNumber: 'Pf46',
        renderData: CardRenderer.builder((b) => {
          b.cards(2).venus(1).br;
          b.megacredits(1).slash().venus(1, {played});
        }),
        description: 'Draw 2 cards. Raise Venus 1 step. Gain 1M€ for each of your Venus tags, including this.',
      },
    });
  }

  public play(player: Player) {
    player.drawCard(2);
    player.game.increaseVenusScaleLevel(player, 1);
    const tagCount = player.tags.count(Tag.VENUS) + 1;
    player.addResource(Resources.MEGACREDITS, tagCount, {log: true});
    return undefined;
  }
}

