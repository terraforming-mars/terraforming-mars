import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';

export class InterstellarColonyShip extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.INTERSTELLAR_COLONY_SHIP,
      tags: [Tags.EARTH, Tags.SPACE],
      cost: 24,

      metadata: {
        description: 'Requires that you have 5 Science tags.',
        cardNumber: '027',
        requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 5)),
        victoryPoints: 4,
      },
    });
  }
  public play(player: Player, _game: Game) {
    if (player.getTagCount(Tags.SCIENCE) < 5) {
      throw 'Requires 5 science tags.';
    }
    return undefined;
  }
  public getVictoryPoints() {
    return 4;
  }
}
