import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';
import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {CardResource} from '../../../common/CardResource';
import {ColoniesHandler} from '../../colonies/ColoniesHandler';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {SelectColony} from '../../inputs/SelectColony';
import {IColonyTrader} from '../../colonies/IColonyTrader';
import {IColony} from '../../colonies/IColony';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

function tradeCost(player: Player) {
  return Math.max(0, 3 - player.colonies.tradeDiscount);
}
export class CollegiumCopernicus extends Card implements ICorporationCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.COLLEGIUM_COPERNICUS,
      tags: [Tag.SCIENCE, Tag.EARTH],
      startingMegaCredits: 33,
      resourceType: CardResource.DATA,

      behavior: {
        addResourcesToAnyCard: {count: 1, type: CardResource.DATA},
      },

      initialActionText: 'Draw 2 cards with a science tag',

      metadata: {
        cardNumber: 'PfC4',
        description: 'You start with 33 M€. As your first action, draw 2 cards with a science tag.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(33).cards(2, {secondaryTag: Tag.SCIENCE}).br;
          b.effect('When you play a card with a science tag (including this) Add 1 data to ANY card.', (eb) => {
            eb.science(1, {played}).startEffect.data().asterix();
          }).br;
          b.action('Spend 3 data from this card to trade.', (eb) => {
            eb.data({amount: 3}).startAction.trade();
          });
        }),
      },
    });
  }

  public initialAction(player: Player) {
    player.drawCard(2, {tag: Tag.SCIENCE});
    return undefined;
  }

  public onCorpCardPlayed(player: Player, card: ICorporationCard) {
    this.onCardPlayed(player, card);
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard | ICorporationCard): void {
    if (player.tags.cardHasTag(card, Tag.SCIENCE) && player.isCorporation(this.name)) {
      player.game.defer(new AddResourcesToCard(player, CardResource.DATA, {count: 1}));
    }
  }

  public canAct(player: Player) {
    return player.colonies.canTrade() && this.resourceCount >= tradeCost(player);
  }

  public action(player: Player) {
    const game = player.game;
    game.defer(new SimpleDeferredAction(
      player,
      () => new SelectColony('Select colony tile to trade with', 'Select', ColoniesHandler.tradeableColonies(game), (colony) => {
        tradeWithColony(this, player, colony);
        return undefined;
      }),
    ));
    return undefined;
  }
}

export function tradeWithColony(card: ICorporationCard, player: Player, colony: IColony) {
  const cost = tradeCost(player);
  card.resourceCount -= cost;
  player.game.log('${0} spent ${1} data from ${2} to trade with ${3}', (b) => b.player(player).number(cost).card(card).colony(colony));
  colony.trade(player);
}
export class TradeWithCollegiumCopernicus implements IColonyTrader {
  private collegiumCopernicus: ICorporationCard | undefined;

  constructor(private player: Player) {
    this.collegiumCopernicus = player.getCorporation(CardName.COLLEGIUM_COPERNICUS);
  }

  public canUse() {
    return (this.collegiumCopernicus?.resourceCount ?? 0) >= tradeCost(this.player) &&
      !this.player.getActionsThisGeneration().has(CardName.COLLEGIUM_COPERNICUS);
  }

  public optionText() {
    return 'Pay 3 Data (use Collegium Copernicus action)';
  }

  public trade(colony: IColony) {
    this.player.addActionThisGeneration(CardName.COLLEGIUM_COPERNICUS);
    if (this.collegiumCopernicus !== undefined) {
      tradeWithColony(this.collegiumCopernicus, this.player, colony);
    }
  }
}
