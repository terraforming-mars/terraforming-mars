import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../SpaceType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class StanfordTorus extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.STANFORD_TORUS,
      tags: [Tags.SPACE, Tags.CITY],
      cost: 12,

      metadata: {
        cardNumber: 'X12',
        renderData: CardRenderer.builder((b) => {
          b.city().asterix();
        }),
        description: 'Place a city tile IN SPACE, outside and separate from the planet.',
        victoryPoints: 2,
      },
    });
  }

  public play(player: Player) {
    player.game.addCityTile(player, SpaceName.STANFORD_TORUS, SpaceType.COLONY);
    return undefined;
  }

  public getVictoryPoints() {
    return 2;
  }
}
