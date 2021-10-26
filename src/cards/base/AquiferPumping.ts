import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

export const OCEAN_COST = 8;
export class AquiferPumping extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.AQUIFER_PUMPING,
      tags: [Tags.BUILDING],
      cost: 18,

      metadata: {
        cardNumber: '187',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 8 M€ to place 1 ocean tile. STEEL MAY BE USED as if you were playing a Building card.', (eb) => eb.megacredits(8).openBrackets.steel(1).closeBrackets.startAction.oceans(1));
        }),
      },
    });
  }

  public play() {
    return undefined;
  }
  public canAct(player: Player): boolean {
    return player.canAfford(OCEAN_COST, {steel: true, tr: {oceans: 1}});
  }
  public action(player: Player) {
    player.game.defer(new SelectHowToPayDeferred(player, 8, {canUseSteel: true, title: 'Select how to pay for action', afterPay: () => {
      player.game.defer(new PlaceOceanTile(player));
    }}));
    return undefined;
  }
}
