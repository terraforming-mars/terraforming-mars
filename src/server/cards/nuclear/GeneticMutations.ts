import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
//import {Resource} from '../../../common/Resource';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../requirements/CardRequirements';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';
import {Board} from '../../boards/Board';
import {ActionCard} from '../ActionCard';
import { digit } from '../Options';

export class GeneticMutations extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.GENETIC_MUTATIONS,
      tags: [Tag.PLANT],
      cost: 12,

      resourceType: CardResource.RADIATION,
      victoryPoints: 2,
      requirements: CardRequirements.builder((b) => b.tag(Tag.RADIATION, 2).tag(Tag.PLANT, 2)),

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              spend: {resourcesHere: 2},
              removeAnyPlants: 2,
              title: 'Remove 2 radiation here to remove 2 plant from any player.',
            },
            {
              spend: {resourcesHere: 2},
              removeResourcesFromCard: {type:CardResource.MICROBE, count: 2},
              title: 'Remove 2 radiation here to remove 2 microbes from any player.',
            },
          ],
        },
      },

      metadata: {
        cardNumber: 'N51',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you place a greenery tile, add 1 radiation to this card.', (eb) => {
            eb.greenery(Size.SMALL, false).startEffect.radiations(1);
          }).br;
          b.action('Remove 2 radiation here to remove 2 microbes from any player', (eb) => {
          eb.radiations(2, {digit}).startAction.plants(2, {digit, all}).or().microbes(2, {digit, all});
        })
        }),
        description: {
        // TODO (chosta): revert the original description once a solution for description space is found
          text: 'Requires 2 radiation and 2 plant tags.',
          align: 'left',
        },
      },
    });
  }
  

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (cardOwner.id === activePlayer.id && Board.isGreenerySpace(space)) {
      cardOwner.game.defer(new AddResourcesToCard(cardOwner, CardResource.ANIMAL, {filter: (c) => c.name === this.name}));
    }
  }
}
