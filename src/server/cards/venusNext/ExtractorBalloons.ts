import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../../common/cards/CardName';
import {MAX_VENUS_SCALE} from '../../../common/constants';
import {LogHelper} from '../../LogHelper';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Card} from '../Card';

export class ExtractorBalloons extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.EXTRACTOR_BALLOONS,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS],
      cost: 21,
      resourceType: CardResource.FLOATER,

      behavior: {
        addResources: 3,
      },

      // action: {
      //   or: {
      //     autoSelect: true,
      //     behaviors: [{
      //       title: 'Remove 2 floaters here to raise Venus 1 step.',
      //       spend: {resourcesHere: 2},
      //       global: {venus: 1},
      //       // Don't offer this if Venus isn't maximized?
      //       // // // LogHelper.logRemoveResource(player, this, 2, 'raise oxygen 1 step');
      //     },
      //     {
      //       title: 'Add 1 floater to this card.',
      //       addResources: 1,
      //     }],
      //   },
      // },

      metadata: {
        cardNumber: '223',
        description: 'Add 3 floaters to this card',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 floater to this card.', (eb) => {
            eb.empty().startAction.floaters(1);
          }).br;
          b.action('Remove 2 floaters here to raise Venus 1 step.', (eb) => {
            eb.or(Size.SMALL).floaters(2).startAction.venus(1);
          }).br.floaters(3);
        }),
      },
    });
  }

  public canAct(): boolean {
    return true;
  }
  public action(player: IPlayer) {
    const venusMaxed = player.game.getVenusScaleLevel() === MAX_VENUS_SCALE;
    const canAffordReds = player.canAfford({cost: 0, tr: {venus: 1}});
    if (this.resourceCount < 2 || venusMaxed || !canAffordReds) {
      player.addResourceTo(this, {log: true});
      return undefined;
    }
    return new OrOptions(
      new SelectOption('Remove 2 floaters to raise Venus scale 1 step',
        'Remove floaters').andThen(() => {
        player.removeResourceFrom(this, 2);
        const actual = player.game.increaseVenusScaleLevel(player, 1);
        LogHelper.logVenusIncrease(player, actual);
        return undefined;
      }),
      new SelectOption('Add 1 floater to this card', 'Add floater').andThen(() => {
        player.addResourceTo(this, {log: true});
        return undefined;
      }),
    );
  }
}
