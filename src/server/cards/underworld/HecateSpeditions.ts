import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {IPlayer} from '../../IPlayer';
import {ActiveCorporationCard} from '../corporation/CorporationCard';
import {Size} from '../../../common/cards/render/Size';
import {ICard} from '../ICard';
import {isPlanetaryTag} from '../../pathfinders/PathfindersData';
import {IColonyTrader} from '../../colonies/IColonyTrader';
import {message} from '../../logs/MessageBuilder';
import {IColony} from '../../colonies/IColony';
import {CardResource} from '../../../common/CardResource';
import {digit} from '../Options';

function tradeCost(player: IPlayer) {
  return Math.max(1, 2 - player.colonies.tradeDiscount);
}

export class HecateSpeditions extends ActiveCorporationCard {
  constructor() {
    super({
      name: CardName.HECATE_SPEDITIONS,
      tags: [Tag.EARTH],
      startingMegaCredits: 38,
      resourceType: CardResource.SUPPLY_CHAIN,

      behavior: {
        addResources: 1,
      },

      firstAction: {
        colonies: {buildColony: {}},
        text: 'Place a colony',
      },

      action: {
        spend: {resourcesHere: 5},
        colonies: {addTradeFleet: 1},
      },

      metadata: {
        cardNumber: 'U12',
        description: 'You start with 38 M€. As your first action, place a colony.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(38).colonies().br;
          b.effect('When you play an Earth, Mars, Venus, Moon, or Jovian tag, including this, put 1 supply chain resource on this card.',
            (eb) => eb.tag(Tag.EARTH).tag(Tag.MARS).tag(Tag.VENUS).tag(Tag.MOON).tag(Tag.JOVIAN).startEffect.resource(CardResource.SUPPLY_CHAIN));
          b.br;
          b.resource(CardResource.SUPPLY_CHAIN, {amount: 2, digit}).colon().trade({size: Size.SMALL}).nbsp;
          b.resource(CardResource.SUPPLY_CHAIN, {amount: 5, digit}).arrow(Size.SMALL).tradeFleet().br;
          b.plainText('(Effect: Spend 2 supply chain resources (min. 1) to trade.) ' +
            '(Action: Spend 5 supply chain resources to gain a trade fleet.)');
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: ICard) {
    if (!player.isCorporation(this.name)) {
      return;
    }
    const count = card.tags.filter((tag) => isPlanetaryTag(tag)).length;
    player.addResourceTo(this, {qty: count, log: true, logZero: false});
  }

  public onCorpCardPlayed(player: IPlayer, card: ICorporationCard) {
    this.onCardPlayed(player, card);
  }
}

// TODO(kberg): I this pattern has occurred enough times that this can be reduced.
export class TradeWithHectateSpeditions implements IColonyTrader {
  private hectateSpeditions: ICorporationCard | undefined;

  constructor(private player: IPlayer) {
    this.hectateSpeditions = player.getCorporation(CardName.HECATE_SPEDITIONS);
  }

  public canUse() {
    return (this.hectateSpeditions?.resourceCount ?? 0) >= tradeCost(this.player) &&
      !this.player.getActionsThisGeneration().has(CardName.HECATE_SPEDITIONS);
  }

  public optionText() {
    return message('Pay ${0} ${1} resources (use ${2} action)', (b) => b.number(tradeCost(this.player)).string('supply chain').cardName(CardName.HECATE_SPEDITIONS));
  }

  private tradeWithColony(card: ICorporationCard, player: IPlayer, colony: IColony) {
    const cost = tradeCost(player);
    card.resourceCount -= cost;
    player.game.log('${0} spent ${1} ${2} from ${3} to trade with ${4}',
      (b) => b.player(player).number(cost).string('supply chain resources').card(card).colony(colony));
    colony.trade(player);
  }

  public trade(colony: IColony) {
    if (this.hectateSpeditions !== undefined) {
      this.tradeWithColony(this.hectateSpeditions, this.player, colony);
    }
  }
}
