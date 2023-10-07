import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectCard} from '../../inputs/SelectCard';
import {CardResource} from '../../../common/CardResource';
import {ICard} from '../ICard';
import {CardName} from '../../../common/cards/CardName';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class LocalHeatTrapping extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.LOCAL_HEAT_TRAPPING,
      cost: 1,

      // Normally reserveUnits is managed by the rest of the game engine. But in this case
      // the only purpose of reserveUnits is to prevent the player from spending that heat
      // as Helion. Managing reserveUnits in this case will be handled by overriding canPlay
      // and play, which is not a rare behavior.
      //
      // This is made that much more complicated thanks to Merger and Stormcraft Incorporated.
      reserveUnits: {heat: 5},

      metadata: {
        cardNumber: '190',
        renderData: CardRenderer.builder((b) => {
          b.minus().heat(5, {digit});
          b.plus().plants(4, {digit});
          b.or().animals(2, {digit}).asterix();
        }),
        description: 'Spend 5 heat to gain either 4 plants, or to add 2 animals to ANOTHER card.',
      },
    });
  }

  public override canPlay(player: IPlayer) {
    // This card can cost 0 or 1.
    const cardCost = player.getCardCost(this); // Would be nice to use precalculated value.

    let heat = player.heat;
    let floaters = player.getCorporation(CardName.STORMCRAFT_INCORPORATED)?.resourceCount ?? 0;

    // If the card costs anything, determine where that 1MC can come from. Assume it can come from MC first.
    if (cardCost === 1 && player.megaCredits === 0) {
      if (heat > 0) {
        heat--;
      } else if (floaters > 0) {
        floaters--;
      } else {
        return false;
      }
    }

    // At this point, the card cost has been assumed handled, and it's just a question of whether there's 5 heat
    // left.

    const availableHeat = heat + (floaters * 2);
    return availableHeat >= 5;
  }

  // By overriding play, the heat is not deducted automatically.
  public override play(player: IPlayer) {
    const availableActions = new OrOptions();

    const animalCards: Array<ICard> = player.getResourceCards(CardResource.ANIMAL);
    const gainPlantsOption = new SelectOption('Gain 4 plants', 'Gain plants').andThen(() => {
      player.stock.add(Resource.PLANTS, 4, {log: true});
      return undefined;
    });

    if (animalCards.length === 0) {
      availableActions.options.push(gainPlantsOption);
    } else if (animalCards.length === 1) {
      const targetCard = animalCards[0];
      availableActions.options.push(
        gainPlantsOption,
        new SelectOption('Add 2 animals to ' + targetCard.name, 'Add animals').andThen(() => {
          player.addResourceTo(targetCard, {qty: 2, log: true});
          return undefined;
        }));
    } else {
      availableActions.options.push(
        gainPlantsOption,
        new SelectCard('Select card to add 2 animals', 'Add animals', animalCards)
          .andThen(([card]) => {
            player.addResourceTo(card, {qty: 2, log: true});
            return undefined;
          }));
    }

    return player.spendHeat(5, () => {
      if (availableActions.options.length === 1) return availableActions.options[0].cb();
      return availableActions;
    });
  }
}
