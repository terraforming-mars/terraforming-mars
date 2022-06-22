import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';

export class InterstellarColonyShip extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.INTERSTELLAR_COLONY_SHIP,
      tags: [Tags.EARTH, Tags.SPACE],
      cost: 24,
      victoryPoints: 4,

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 5)),
      metadata: {
        description: 'Requires that you have 5 Science tags.',
        cardNumber: '027',
      },
    });
  }
  public play() {
    return undefined;
  }
}
