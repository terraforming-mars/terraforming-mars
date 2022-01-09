import {Card} from '../Card';
import {CorporationCard} from '../corporation/CorporationCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';
import {IProjectCard} from '../IProjectCard';
import {IActionCard, ICard} from '../ICard';
import {ResourceType} from '../../ResourceType';
import {ColoniesHandler} from '../../colonies/ColoniesHandler';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {SelectColony} from '../../inputs/SelectColony';
import {IColonyTrader} from '../../colonies/IColonyTrader';
import {Colony} from '../../colonies/Colony';

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

  public play() {
    return undefined;
  }

  public initialAction(player: Player) {
    player.drawCard(2, {tag: Tags.SCIENCE});
    player.addResourceTo(this, {log: true});
    return undefined;
  }

  public onCorpCardPlayed(player: Player, card: CorporationCard) {
    return this.onCardPlayed(player, card as ICard as IProjectCard);
  }

  public onCardPlayed(player: Player, card: IProjectCard): void {
    if (card.tags.includes(Tags.SCIENCE) && player.isCorporation(this.name)) {
      player.addResourceTo(this, {log: true});
    }
  }

  public canAct(player: Player) {
    return ColoniesHandler.canTrade(player) && this.resourceCount >= tradeCost(player);
  }

  public action(player: Player) {
    const game = player.game;
    game.defer(new DeferredAction(
      player,
      () => new SelectColony('Select colony tile to trade with for free', 'Select', ColoniesHandler.tradeableColonies(game), (colony) => {
        this.resourceCount -= tradeCost(player);
        game.log('${0} spent ${1} data to trade with ${2}', (b) => b.player(player).number(tradeCost(player)).colony(colony));
        colony.trade(player);
        return undefined;
      }),
    ));
    return undefined;
  }
}

export class TradeWithCollegiumCopernicus implements IColonyTrader {
  private collegiumCopernicus: CollegiumCopernicus | undefined;

  constructor(private player: Player) {
    this.collegiumCopernicus = player.isCorporation(CardName.COLLEGIUM_COPERNICUS) ?
      player.corporationCard as CollegiumCopernicus : undefined;
  }

  public canUse() {
    return (this.collegiumCopernicus?.resourceCount ?? 0) >= tradeCost(this.player) &&
      !this.player.getActionsThisGeneration().has(CardName.COLLEGIUM_COPERNICUS);
  }

  public optionText() {
    return 'Pay 3 Data (use Collegium Copernicus action)';
  }

  public trade(colony: Colony) {
    if (this.collegiumCopernicus !== undefined) this.collegiumCopernicus.resourceCount -= tradeCost(this.player);
    this.player.addActionThisGeneration(CardName.COLLEGIUM_COPERNICUS);
    this.player.game.log('${0} spent ${1} data to trade with ${2}', (b) => b.player(this.player).number(tradeCost(this.player)).colony(colony));
    colony.trade(this.player);
  }
}
