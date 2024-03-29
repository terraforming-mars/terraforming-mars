import {CardRenderer} from '../render/CardRenderer';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {Size} from '../../../common/cards/render/Size';
import {GlobalParameter} from '../../../common/GlobalParameter';
import {IPlayer} from '../../IPlayer';
import {ICard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Priority, SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {CardRequirementDescriptor} from '../../../common/cards/CardRequirementDescriptor';
import {IGame} from '../../../server/IGame';

export class ThinkTank extends ActionCard implements ICard {
  constructor() {
    super({
      name: CardName.THINK_TANK,
      type: CardType.ACTIVE,
      cost: 12,
      tags: [Tag.MARS, Tag.VENUS, Tag.SCIENCE],
      resourceType: CardResource.DATA,

      action: {
        spend: {megacredits: 2},
        addResourcesToAnyCard: {count: 1, type: CardResource.DATA},
      },

      metadata: {
        cardNumber: 'Pf49',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 M€ to place 1 data on any card.', (ab) => {
            ab.megacredits(2).startAction.data().asterix();
          }).br;
          b.effect(
            'When playing a card, you can remove data from this card to ' +
            'change the card\'s global requirement by 1 step for every 1 data removed.',
            (eb) => eb.data().startEffect.text('+/-1 global parameter', Size.SMALL));
        }),
      },
    });
  }

  private readonly GlobalReqs: Record<string, GlobalParameter> = {
    temperature: GlobalParameter.TEMPERATURE,
    oxygen: GlobalParameter.OXYGEN,
    oceans: GlobalParameter.OCEANS,
    venus: GlobalParameter.VENUS,
    miningRate: GlobalParameter.MOON_MINING_RATE,
    logisticRate: GlobalParameter.MOON_LOGISTICS_RATE,
    habitatRate: GlobalParameter.MOON_HABITAT_RATE
  }

  // This code should be handled by the Game class
  private getGlobalValue(param: GlobalParameter, game: IGame): number | undefined {
    switch (param) {
      case GlobalParameter.TEMPERATURE:
        return game.getTemperature()
      case GlobalParameter.OXYGEN:
        return game.getOxygenLevel()
      case GlobalParameter.OCEANS:
        return game.board.getOceanSpaces().length
      case GlobalParameter.VENUS:
        return game.getVenusScaleLevel()
      case GlobalParameter.MOON_MINING_RATE:
        return game.moonData?.miningRate
      case GlobalParameter.MOON_LOGISTICS_RATE:
        return game.moonData?.logisticRate
      case GlobalParameter.MOON_HABITAT_RATE:
        return game.moonData?.habitatRate
    }
  }

  private testReq(req: CardRequirementDescriptor, param: keyof CardRequirementDescriptor, player: IPlayer): number {
    const reqVal = req[param]
    const global = this.GlobalReqs[param]
    if (typeof reqVal === "number" && global) {
      const globalValue = this.getGlobalValue(global, player.game)
      if (globalValue) {
        const multiplier = req.max ? -1 : 1;
        const adjustedVal = reqVal + multiplier * (player.getGlobalParameterRequirementBonus(global) - this.resourceCount);
        return Math.min(0, multiplier * (globalValue - adjustedVal));
      }
    }
    return 0
  }

  private distance(card: ICard, player: IPlayer): number {
    let dist = 0;
    card.requirements.forEach((req) => {
      for (const key in req) {
        dist += this.testReq(req, key as keyof CardRequirementDescriptor, player)
      }
    })
    return dist
  }

  public getWarningForCard(player: IPlayer, card: IProjectCard): string | undefined {
    const dist = this.distance(card, player);
    if (dist > 0)
      return `Playing ${card.name} consumes ${dist} data from Think Tank`;
    return undefined;
  }

  public override getGlobalParameterRequirementBonus(_player: IPlayer, _parameter: GlobalParameter): number {
    return this.resourceCount;
  }

  public onCardPlayed(player: IPlayer, card: ICard) {
    player.game.defer(new SimpleDeferredAction(player, () => {
      this.resourceCount -= this.distance(card, player);
      return undefined;
    }, Priority.COST))
  }
}

