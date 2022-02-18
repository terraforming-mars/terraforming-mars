import {Card} from '../Card';
import {CorporationCard} from '../corporation/CorporationCard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';
import {IProjectCard} from '../IProjectCard';
import {IActionCard, ICard} from '../ICard';
import {ResourceType} from '../../common/ResourceType';
import {ColoniesHandler} from '../../colonies/ColoniesHandler';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {SelectColony} from '../../inputs/SelectColony';
import {IColonyTrader} from '../../colonies/IColonyTrader';
import {Colony} from '../../colonies/Colony';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

function tradeCost(player: Player) {
  return Math.max(0, 3 - player.colonyTradeDiscount);
}
export class CollegiumCopernicus extends Card implements CorporationCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.COLLEGIUM_COPERNICUS,
      tags: [Tags.SCIENCE, Tags.EARTH],
      startingMegaCredits: 33,
      resourceType: ResourceType.DATA,

      initialActionText: 'Draw 2 cards with a science tag',

      metadata: {
        cardNumber: 'PfC4',
        description: 'You start with 33 M€. As your first action, draw 2 cards with a science tag.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(33).cards(2, {secondaryTag: Tags.SCIENCE}).br;
          b.effect('When you play a card with a science tag (including this) add 1 data to any card.', (eb) => {
            eb.science(1, {played}).startEffect.data().asterix();
          }).br;
          b.action('Spend 3 data from this card to trade.', (eb) => {
            eb.data({amount: 3}).startAction.trade();
          });
        }),
      },
    });
  }

  public play(player: Player) {
    this.addResource(player);
    return undefined;
  }

  public initialAction(player: Player) {
    player.drawCard(2, {tag: Tags.SCIENCE});
    return undefined;
  }

  public onCorpCardPlayed(player: Player, card: CorporationCard) {
    return this.onCardPlayed(player, card as ICard as IProjectCard);
  }

  public onCardPlayed(player: Player, card: IProjectCard): void {
    if (card.tags.includes(Tags.SCIENCE) && player.isCorporation(this.name)) {
      this.addResource(player);
    }
  }

  private addResource(player: Player) {
    player.game.defer(new AddResourcesToCard(player, ResourceType.DATA, {count: 1}));
  }

  public canAct(player: Player) {
    return ColoniesHandler.canTrade(player) && this.resourceCount >= tradeCost(player);
  }

  public action(player: Player) {
    const game = player.game;
    game.defer(new DeferredAction(
      player,
      () => new SelectColony('Select colony tile to trade with', 'Select', ColoniesHandler.tradeableColonies(game), (colony) => {
        tradeWithColony(this, player, colony);
        return undefined;
      }),
    ));
    return undefined;
  }
}

export function tradeWithColony(card: CorporationCard, player: Player, colony: Colony) {
  const cost = tradeCost(player);
  card.resourceCount -= cost;
  player.game.log('${0} spent ${1} data from ${2} to trade with ${3}', (b) => b.player(player).number(cost).card(card).colony(colony));
  colony.trade(player);
}
export class TradeWithCollegiumCopernicus implements IColonyTrader {
  private collegiumCopernicus: CorporationCard | undefined;

  constructor(private player: Player) {
    this.collegiumCopernicus = player.isCorporation(CardName.COLLEGIUM_COPERNICUS) ?
      player.corporationCard : undefined;
  }

  public canUse() {
    return (this.collegiumCopernicus?.resourceCount ?? 0) >= tradeCost(this.player) &&
      !this.player.getActionsThisGeneration().has(CardName.COLLEGIUM_COPERNICUS);
  }

  public optionText() {
    return 'Pay 3 Data (use Collegium Copernicus action)';
  }

  public trade(colony: Colony) {
    this.player.addActionThisGeneration(CardName.COLLEGIUM_COPERNICUS);
    if (this.collegiumCopernicus !== undefined) {
      tradeWithColony(this.collegiumCopernicus, this.player, colony);
    }
  }
}
