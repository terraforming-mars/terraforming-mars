import {Card} from '../Card';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class EcologicalSurvey extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ECOLOGICAL_SURVEY,
      tags: [Tags.SCIENCE],
      cost: 9,

      metadata: {
        description: 'Requires 3 greeneries on Mars.',
        cardNumber: 'A07',
        requirements: CardRequirements.builder((b) => b.greeneries(3).any()),
        renderData: CardRenderer.builder((b) => {
          b.effect('When placing a tile grants you any plants, animals or microbes, you gain one additional of each of those resources that you gain.', (eb) => {
            eb.emptyTile().startEffect;
            eb.plus().plants(1).animals(1).microbes(1);
          });
        }),
      },
    });
  }

  public play(_player: Player, _game: Game) {
    return undefined;
  }
}
