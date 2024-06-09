import {CorporationCard} from '../corporation/CorporationCard';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard, ICard} from '../ICard';
import {CardResource} from '../../../common/CardResource';
import {ColoniesHandler} from '../../colonies/ColoniesHandler';
import {SelectColony} from '../../inputs/SelectColony';
import {IColonyTrader} from '../../colonies/IColonyTrader';
import {IColony} from '../../colonies/IColony';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {message} from '../../logs/MessageBuilder';

function tradeCost(player: IPlayer) {
  return Math.max(0, 3 - player.colonies.tradeDiscount);
}
export class CollegiumCopernicus extends CorporationCard implements IActionCard {
  constructor() {
    super({
      name: CardName.COLLEGIUM_COPERNICUS,
      tags: [Tag.SCIENCE, Tag.EARTH],
      startingMegaCredits: 33,
      resourceType: CardResource.DATA,

      behavior: {
        addResourcesToAnyCard: {count: 1, type: CardResource.DATA},
      },

      firstAction: {
        text: 'Draw 2 cards with a science tag',
        drawCard: {count: 2, tag: Tag.SCIENCE},
      },

      metadata: {
        cardNumber: 'PfC4',
        description: 'You start with 33 M€. As your first action, draw 2 cards with a science tag.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(33).cards(2, {secondaryTag: Tag.SCIENCE}).br;
          b.effect('When you play a card with a science tag (including this) Add 1 data to ANY card.', (eb) => {
            eb.tag(Tag.SCIENCE).startEffect.resource(CardResource.DATA).asterix();
          }).br;
          b.action('Spend 3 data from this card to trade.', (eb) => {
            eb.resource(CardResource.DATA, 3).startAction.trade();
          });
        }),
      },
    });
  }

  public onCorpCardPlayed(player: IPlayer, card: ICorporationCard) {
    this.onCardPlayed(player, card);
  }

  public onCardPlayed(player: IPlayer, card: ICard): void {
    if (player.tags.cardHasTag(card, Tag.SCIENCE) && player.isCorporation(this.name)) {
      player.game.defer(new AddResourcesToCard(player, CardResource.DATA, {count: 1}));
    }
  }

  public canAct(player: IPlayer) {
    return player.colonies.canTrade() && this.resourceCount >= tradeCost(player);
  }

  public action(player: IPlayer) {
    const game = player.game;
    player.defer(
      new SelectColony('Select colony tile to trade with', 'Select', ColoniesHandler.tradeableColonies(game))
        .andThen((colony) => {
          tradeWithColony(this, player, colony);
          return undefined;
        }),
    );
    return undefined;
  }
}

export function tradeWithColony(card: ICorporationCard, player: IPlayer, colony: IColony) {
  const cost = tradeCost(player);
  card.resourceCount -= cost;
  player.game.log('${0} spent ${1} data from ${2} to trade with ${3}', (b) => b.player(player).number(cost).card(card).colony(colony));
  colony.trade(player);
}
export class TradeWithCollegiumCopernicus implements IColonyTrader {
  private collegiumCopernicus: ICorporationCard | undefined;

  constructor(private player: IPlayer) {
    this.collegiumCopernicus = player.getCorporation(CardName.COLLEGIUM_COPERNICUS);
  }

  public canUse() {
    return (this.collegiumCopernicus?.resourceCount ?? 0) >= tradeCost(this.player) &&
      !this.player.getActionsThisGeneration().has(CardName.COLLEGIUM_COPERNICUS);
  }

  public optionText() {
    return message('Pay ${0} data (use ${1} action)', (b) => b.number(tradeCost(this.player)).cardName(CardName.COLLEGIUM_COPERNICUS));
  }

  public trade(colony: IColony) {
    this.player.addActionThisGeneration(CardName.COLLEGIUM_COPERNICUS);
    if (this.collegiumCopernicus !== undefined) {
      tradeWithColony(this.collegiumCopernicus, this.player, colony);
    }
  }
}
