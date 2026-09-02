import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {SurveyCard} from './SurveyCard';
import {all, max} from '../Options';

export class GeologicalSurvey extends SurveyCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.GEOLOGICAL_SURVEY,
      tags: [Tag.SCIENCE],
      cost: 8,

      requirements: {greeneries: 5, all, max},
      metadata: {
        cardNumber: 'A09',
        renderData: CardRenderer.builder((b) => {
          b.effect('When placing a tile ON MARS grants you any steel, titanium, or heat, you gain one additional of each of those resources that you gain.', (eb) => {
            eb.emptyTile().startEffect;
            eb.plus().steel(1).titanium(1).heat(1);
          });
        }),
        description: 'Requires 5 or fewer greeneries on Mars.',
      },
    });
  }

  protected checkForBonuses(cardOwner: IPlayer, space: Space) {
    super.maybeRewardStandardResource(cardOwner, space, Resource.STEEL, SpaceBonus.STEEL);
    super.maybeRewardStandardResource(cardOwner, space, Resource.TITANIUM, SpaceBonus.TITANIUM);
    super.maybeRewardStandardResource(cardOwner, space, Resource.HEAT, SpaceBonus.HEAT);
  }
}
