import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {Resources} from '../../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class SaturnSurfing extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SATURN_SURFING,
      cost: 13,
      tags: [Tag.JOVIAN, Tag.EARTH],
      resourceType: CardResource.FLOATER,
      victoryPoints: 1,

      behavior: {
        addResources: {tag: Tag.EARTH},
      },

      metadata: {
        cardNumber: 'X11',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 floater from here to gain 1 M€ from each floater here, INCLUDING THE PAID FLOATER. Max 5.', (eb) => {
            eb.floaters(1).startAction.megacredits(1).slash().floaters(1);
            eb.asterix().text('max 5');
          }).br;
          b.floaters(1).slash().earth(1, {played});
        }),
        description: 'Add 1 floater here for every Earth tag you have, including this.',
      },
    });
  }

  public canAct(): boolean {
    return this.resourceCount > 0;
  }

  public action(player: Player) {
    player.addResource(Resources.MEGACREDITS, Math.min(5, this.resourceCount--));
    return undefined;
  }
}
