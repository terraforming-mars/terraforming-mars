import {Tag} from '@/common/cards/Tag';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {CardResource} from '@/common/CardResource';
import {IActionCard} from '@/server/cards/ICard';
import {PreludeCard} from '@/server/cards/prelude/PreludeCard';
import {IPlayer} from '@/server/IPlayer';
import {OrOptions} from '@/server/inputs/OrOptions';
import {SelectCard} from '@/server/inputs/SelectCard';
import {AndOptions} from '@/server/inputs/AndOptions';
import {SelectAmount} from '@/server/inputs/SelectAmount';
import {SelectResource} from '@/server/inputs/SelectResource';
import {Units} from '@/common/Units';

export class FloatingTradeHub extends PreludeCard implements IActionCard {
  constructor() {
    super({
      name: CardName.FLOATING_TRADE_HUB,
      tags: [Tag.SPACE],
      resourceType: CardResource.FLOATER,

      metadata: {
        cardNumber: 'P49',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 2 floaters to ANY card.', (ab) => ab.empty().startAction.resource(CardResource.FLOATER, 2).asterix()).br;
          b.action('Remove any number of floaters here to gain that many of one standard resource.', (ab) => {
            ab.text('X').resource(CardResource.FLOATER).startAction.text('X').wild(1);
          }).br;
        }),
      },
    });
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: IPlayer) {
    const add2Floaters = new SelectCard('Select card to gain 2 floaters', undefined, player.getResourceCards(CardResource.FLOATER)).andThen(([card]) => {
      player.addResourceTo(card, {qty: 2, log: true});
      return undefined;
    });
    const selectResource = new SelectResource('Select resource to gain');
    const selectAmount = new SelectAmount('Select amount of floaters to remove', undefined, 1, this.resourceCount, true);
    const removeFloaters = new AndOptions(selectAmount, selectResource)
      .setTitle('Convert floaters to standard resources')
      .andThen(() => {
        // TODO(kberg): Add a better log message.
        player.removeResourceFrom(this, selectAmount.selected, {log: true});
        player.stock.add(Units.ResourceMap[selectResource.selected], selectAmount.selected, {log: true, from: {card: this}});
        return undefined;
      });
    if (this.resourceCount === 0) {
      return add2Floaters;
    }
    return new OrOptions(add2Floaters, removeFloaters);
  }
}
