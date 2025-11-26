import {IActionCard} from '@/server/cards/ICard';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {IPlayer} from '@/server/IPlayer';
import {CardName} from '@/common/cards/CardName';
import {PlaceOceanTile} from '@/server/deferredActions/PlaceOceanTile';
import {SelectPaymentDeferred} from '@/server/deferredActions/SelectPaymentDeferred';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {TITLES} from '@/server/inputs/titles';

const ACTION_COST = 12;
export class WaterImportFromEuropa extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.WATER_IMPORT_FROM_EUROPA,
      tags: [Tag.JOVIAN, Tag.SPACE],
      cost: 25,

      victoryPoints: {tag: Tag.JOVIAN},

      metadata: {
        cardNumber: '012',
        renderData: CardRenderer.builder((b) => {
          b.action('Pay 12 M€ to place an ocean tile. TITANIUM MAY BE USED as if playing a space card.', (eb) => {
            eb.megacredits(12).super((b) => b.titanium(1)).startAction.oceans(1);
          }).br;
          b.vpText('1 VP for each Jovian tag you have.');
        }),
      },
    });
  }
  public canAct(player: IPlayer): boolean {
    return player.canAfford({cost: ACTION_COST, titanium: true, tr: {oceans: 1}});
  }
  public action(player: IPlayer) {
    player.game.defer(new SelectPaymentDeferred(player, ACTION_COST, {canUseTitanium: true, title: TITLES.action}))
      .andThen(() => player.game.defer(new PlaceOceanTile(player)));
    return undefined;
  }
}
