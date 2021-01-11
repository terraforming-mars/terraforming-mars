import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectCard} from '../../inputs/SelectCard';
import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class BusinessNetwork extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.BUSINESS_NETWORK,
      tags: [Tags.EARTH],
      cost: 4,
      hasRequirements: false,

      metadata: {
        cardNumber: '110',
        description: 'Decrease your MC production 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.action(undefined, (eb) => eb.empty().startAction.empty()).text('Action: Look at the top card and either buy it or discard it', CardRenderItemSize.SMALL, true).br;
          b.production((pb) => pb.megacredits(-1));
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.MEGACREDITS) >= -4;
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, -1);
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player, game: Game) {
    const dealtCard = game.dealer.dealCard();
    const canSelectCard = player.canAfford(player.cardCost);

    return new SelectCard(
      canSelectCard ? 'Select card to keep or none to discard' : 'You cannot pay for this card',
      canSelectCard ? 'Select' : undefined,
      [dealtCard],
      (cards: Array<IProjectCard>) => {
        if (cards.length === 0 || !canSelectCard) {
          LogHelper.logCardChange( player, 'discarded', 1);
          game.dealer.discard(dealtCard);
          return undefined;
        }
        LogHelper.logCardChange( player, 'drew', 1);
        player.cardsInHand.push(dealtCard);
        game.defer(new SelectHowToPayDeferred(player, player.cardCost, {title: 'Select how to pay for action'}));
        return undefined;
      },
      canSelectCard ? 1 : 0,
      0,
    );
  }
}
