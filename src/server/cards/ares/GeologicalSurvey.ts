import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {Resources} from '../../../common/Resources';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {SurveyCard} from './SurveyCard';
import {all, max} from '../Options';

export class GeologicalSurvey extends SurveyCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.GEOLOGICAL_SURVEY,
      tags: [Tag.SCIENCE],
      cost: 8,

      requirements: CardRequirements.builder((b) => b.greeneries(5, {all, max})),
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

  public checkForBonuses(cardOwner: Player, space: ISpace) {
    super.testForStandardResource(cardOwner, space, Resources.STEEL, SpaceBonus.STEEL);
    super.testForStandardResource(cardOwner, space, Resources.TITANIUM, SpaceBonus.TITANIUM);
    super.testForStandardResource(cardOwner, space, Resources.HEAT, SpaceBonus.HEAT);
  }
}
