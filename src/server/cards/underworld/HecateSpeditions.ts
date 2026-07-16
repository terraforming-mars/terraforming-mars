import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {CorporationCard} from '../corporation/CorporationCard';
import {Size} from '../../../common/cards/render/Size';
import {ICard} from '../ICard';
import {isPlanetaryTag} from '../../pathfinders/PathfindersData';
import {IColonyTrader} from '../../colonies/IColonyTrader';
import {message} from '../../logs/MessageBuilder';
import {IColony} from '../../colonies/IColony';
import {CardResource} from '../../../common/CardResource';
import {digit} from '../Options';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class HecateSpeditions extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.HECATE_SPEDITIONS,
      tags: [Tag.EARTH, Tag.SPACE],
      startingMegaCredits: 38,
      resourceType: CardResource.SUPPLY_CHAIN,

      behavior: {
        addResources: 2,
        colonies: {addTradeFleet: 1},
      },

      metadata: {
        cardNumber: 'UC12',
        description: 'You start with 38 M€, 2 supply chain resources here, and an extra trade fleet.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(38).resource(CardResource.SUPPLY_CHAIN, 2).tradeFleet().br;
          b.effect('When you play an Earth, Mars, Venus, Moon, or Jovian tag, including this, put 1 supply chain resource on this card.',
            (eb) => eb.tag(Tag.EARTH).tag(Tag.MARS).tag(Tag.VENUS).tag(Tag.MOON).tag(Tag.JOVIAN).startEffect.resource(CardResource.SUPPLY_CHAIN));
          b.br;
          b.effect('Spend 2 supply chain resources to trade. THIS COST CANNOT BE REDUCED BY OTHER EFFECTS.',
            (eb) => eb.resource(CardResource.SUPPLY_CHAIN, {amount: 2, digit}).startEffect.trade({size: Size.SMALL}));
        }),
      },
    });
  }

  public onCardPlayedForCorps(player: IPlayer, card: ICard) {
    const count = card.tags.filter((tag) => isPlanetaryTag(tag)).length;
    player.addResourceTo(this, {qty: count, log: true, logZero: false});
  }
}

export class TradeWithHectateSpeditions implements IColonyTrader {
  private hectateSpeditions: ICard | undefined;
  private readonly tradeCost: number = 2;

  constructor(private player: IPlayer) {
    this.hectateSpeditions = player.tableau.get(CardName.HECATE_SPEDITIONS);
  }

  public canUse() {
    return (this.hectateSpeditions?.resourceCount ?? 0) >= this.tradeCost;
  }

  public optionText() {
    return message('Pay ${0} ${1} resources (use ${2} action)', (b) => b.number(this.tradeCost).string('supply chain').cardName(CardName.HECATE_SPEDITIONS));
  }

  private tradeWithColony(card: ICard, player: IPlayer, colony: IColony) {
    card.resourceCount -= this.tradeCost;
    player.game.log('${0} spent ${1} ${2} from ${3} to trade with ${4}',
      (b) => b.player(player).number(this.tradeCost).string('supply chain resources').card(card).colony(colony));
    colony.trade(player);
  }

  public trade(colony: IColony) {
    if (this.hectateSpeditions !== undefined) {
      this.tradeWithColony(this.hectateSpeditions, this.player, colony);
    }
  }
}
