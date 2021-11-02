import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRenderer} from '../render/CardRenderer';

const ACTION_COST = 12;
export class WaterImportFromEuropa extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.WATER_IMPORT_FROM_EUROPA,
      tags: [Tags.JOVIAN, Tags.SPACE],
      cost: 25,

      victoryPoints: VictoryPoints.tags(Tags.JOVIAN, 1, 1),

      metadata: {
        cardNumber: '012',
        renderData: CardRenderer.builder((b) => {
          b.action('Pay 12 M€ to place an ocean tile. TITANIUM MAY BE USED as if playing a Space card.', (eb) => {
            eb.megacredits(12).openBrackets.titanium(1).closeBrackets.startAction.oceans(1);
          }).br;
          b.vpText('1 VP for each Jovian tag you have.');
        }),
      },
    });
  }
  public play() {
    return undefined;
  }
  public canAct(player: Player): boolean {
    return player.canAfford(ACTION_COST, {titanium: true, tr: {oceans: 1}});
  }
  public action(player: Player) {
    player.game.defer(new SelectHowToPayDeferred(player, ACTION_COST, {canUseTitanium: true, title: 'Select how to pay for action', afterPay: () => {
      player.game.defer(new PlaceOceanTile(player));
    }}));
    return undefined;
  }
}
