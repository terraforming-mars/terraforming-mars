/*import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {Size} from '../../../common/cards/render/Size';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
//import {SelectCard} from '../../inputs/SelectCard';

export class Cockroaches extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.COCKROACHES,
      tags: [Tag.ANIMAL],
      cost: 15,

      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: {}},
      requirements: CardRequirements.builder((b) => b.oxygen(6)),

      metadata: {
        cardNumber: 'N35',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 animal to this card', (eb) => {
            eb.startAction.animals(1)}).br; 
          b.action('Remove 1 radiation from any card and add it to ANOTHER card.', (eb) => {
            eb.or(Size.SMALL).nbsp.nbsp.radiations(1, {all}).startAction.radiations(1);  
          }).br;
          b.vpText('1 VP per animal on this card.');
        }),
        description: 'Requires 6% oxygen.',
      },
    });
  }

  public canAct(player: Player): boolean {
    if (player.game.isSoloMode()) return true;
    return RemoveResourcesFromCard.getAvailableTargetCards(player, CardResource.RADIATION).length > 0;
  }

  public action(player: Player) {
    const availableRadiationCards = player.getResourceCards(CardResource.RADIATION);
    const addAnimalHere = player.game.defer(new AddResourcesToCard(player, CardResource.ANIMAL, {filter: (c) => c.name === this.name}));


    if (availableRadiationCards.length === 0) {
      addAnimalHere;
      return undefined;
    }

    const gainRadiationOption = new SelectOption('Remove 1 radiation from ANY card and add it to another card', 'Gain radiation', () => {
    player.game.defer(new RemoveResourcesFromCard(player, CardResource.RADIATION));
    player.game.defer(new AddResourcesToCard(player, CardResource.RADIATION));
    return undefined;
  });

  if (availableRadiationCards.length === 1) {
    const targetCard = availableRadiationCards[0];

      return new OrOptions(
        new SelectOption('Add 1 radiation to ' + targetCard.name, 'Add radiation', () => {
          player.addResourceTo(targetCard, {log: true});
          return undefined;
        }),
        gainRadiationOption,
      );
    }

    return OrOptions;
  }
}*/
