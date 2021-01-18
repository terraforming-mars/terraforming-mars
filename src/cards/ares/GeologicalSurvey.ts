import {Card} from '../Card';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class GeologicalSurvey extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.GEOLOGICAL_SURVEY,
      tags: [Tags.SCIENCE],
      cost: 8,

      metadata: {
        cardNumber: 'A09',
        requirements: CardRequirements.builder((b) => b.greeneries(5).any().max()),
        renderData: CardRenderer.builder((b) => {
          b.effect('When placing a tile grants you any steel, titanium, or heat, you gain one additional of each of those resources that you gain.', (eb) => {
            eb.emptyTile().startEffect;
            eb.plus().steel(1).titanium(1).heat(1);
          });
        }),
        description: 'Requires 5 or fewer greeneries on Mars.',
      },
    });
  }

  public play(_player: Player, _game: Game) {
    return undefined;
  }
}
