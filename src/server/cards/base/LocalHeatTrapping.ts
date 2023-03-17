import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectCard} from '../../inputs/SelectCard';
import {CardResource} from '../../../common/CardResource';
import {ICard} from '../ICard';
import {CardName} from '../../../common/cards/CardName';
import {Resources} from '../../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class LocalHeatTrapping extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.LOCAL_HEAT_TRAPPING,
      cost: 1,
      // The 5 heat will be deducted in bespokePlay
      reserveUnits: {heat: 5, deduct: false},

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
  public override bespokePlay(player: Player) {
    const animalCards: Array<ICard> = player.getResourceCards(CardResource.ANIMAL);
    const availableActions = new OrOptions();

    const gain4Plants = function() {
      player.addResource(Resources.PLANTS, 4, {log: true});
      return undefined;
    };
    if (animalCards.length === 0) {
      availableActions.options.push(new SelectOption('Gain 4 plants', 'Gain plants', gain4Plants));
    } else if (animalCards.length === 1) {
      const targetCard = animalCards[0];
      availableActions.options.push(
        new SelectOption('Gain 4 plants', 'Gain plants', gain4Plants),
        new SelectOption('Add 2 animals to ' + targetCard.name, 'Add animals', () => {
          player.addResourceTo(targetCard, {qty: 2, log: true});
          return undefined;
        }));
    } else {
      availableActions.options.push(
        new SelectOption('Gain 4 plants', 'Gain plants', gain4Plants),
        new SelectCard('Select card to add 2 animals', 'Add animals', animalCards, ([card]) => {
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
