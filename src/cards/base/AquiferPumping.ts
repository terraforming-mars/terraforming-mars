import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

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
          b.action('Spend 8 M€ to place 1 ocean tile. STEEL MAY BE USED as if you were playing a Building card.', (eb) => eb.megacredits(8).steel(1).brackets.startAction.oceans(1));
        }),
      },
    });
  }

  public play() {
    return undefined;
  }
  public canAct(player: Player): boolean {
    const oceansMaxed = player.game.board.getOceansOnBoard() === MAX_OCEAN_TILES;
    const oceanCost = 8;

    if (oceansMaxed) return player.canAfford(oceanCost, {steel: true});

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(oceanCost + REDS_RULING_POLICY_COST, {steel: true});
    }

    return player.canAfford(oceanCost, {steel: true});
  }
  public action(player: Player) {
    player.game.defer(new SelectHowToPayDeferred(player, 8, {canUseSteel: true, title: 'Select how to pay for action', afterPay: () => {
      player.game.defer(new PlaceOceanTile(player));
    }}));
    return undefined;
  }
}
