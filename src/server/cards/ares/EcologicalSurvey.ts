import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {Resources} from '../../../common/Resources';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {SurveyCard} from './SurveyCard';
import {all} from '../Options';

export class EcologicalSurvey extends SurveyCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ECOLOGICAL_SURVEY,
      tags: [Tag.SCIENCE],
      cost: 9,

      requirements: CardRequirements.builder((b) => b.greeneries(3, {all})),
      metadata: {
        description: 'Requires 3 greeneries on Mars.',
        cardNumber: 'A07',
        renderData: CardRenderer.builder((b) => {
          b.effect('When placing a tile grants you any plants, animals or microbes, you gain one additional of each of those resources that you gain.', (eb) => {
            eb.emptyTile().startEffect;
            eb.plus().plants(1).animals(1).microbes(1);
          });
        }),
      },
    });
  }

  public checkForBonuses(cardOwner: Player, space: ISpace) {
    super.testForStandardResource(cardOwner, space, Resources.PLANTS, SpaceBonus.PLANT);
    super.testForCardResource(cardOwner, space, CardResource.MICROBE, SpaceBonus.MICROBE);
    super.testForCardResource(cardOwner, space, CardResource.ANIMAL, SpaceBonus.ANIMAL);
  }
}
