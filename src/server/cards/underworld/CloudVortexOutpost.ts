import {IPlayer} from '@/server/IPlayer';
import {Tag} from '@/common/cards/Tag';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {PreludeCard} from '@/server/cards/prelude/PreludeCard';
import {CardResource} from '@/common/CardResource';
import {SelectCardDeferred} from '@/server/deferredActions/SelectCardDeferred';
import {LogHelper} from '@/server/LogHelper';
import {digit} from '@/server/cards/Options';

export class CloudVortexOutpost extends PreludeCard {
  constructor() {
    super({
      name: CardName.CLOUD_VORTEX_OUTPOST,
      tags: [Tag.VENUS],
      resourceType: CardResource.FLOATER,

      behavior: {
        global: {venus: 2},
        addResources: 3,
      },

      metadata: {
        cardNumber: 'UP15',
        renderData: CardRenderer.builder((b) => {
          b.venus(2, {digit}).resource(CardResource.FLOATER, {amount: 3, digit}).br;
          b.plainText('Raise Venus 2 steps. Place 3 floaters on this card.').br;
          b.action('Remove 1 floater from THIS card to add 1 floater to ANOTHER card', (ab) => {
            ab.resource(CardResource.FLOATER).asterix().startAction.resource(CardResource.FLOATER).asterix();
          });
        }),
      },
    });
  }


  private availableCards(player: IPlayer) {
    return player.getResourceCards(this.resourceType).filter((card) => card.name !== this.name);
  }

  public canAct(player: IPlayer): boolean {
    return this.resourceCount > 0 && this.availableCards(player).length > 0;
  }

  public action(player: IPlayer) {
    player.game.defer(
      new SelectCardDeferred(
        player,
        this.availableCards(player),
        {
          title: 'Select card to add 1 floater',
          buttonLabel: 'Add floater',
        },
      ))
      .andThen((card) => {
        this.resourceCount--;
        player.addResourceTo(card, 1);
        LogHelper.logMoveResource(player, CardResource.FLOATER, this, card);
      });
    return undefined;
  }
}
