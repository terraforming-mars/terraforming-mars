import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../SpaceType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class PhobosSpaceHaven extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.PHOBOS_SPACE_HAVEN,
      tags: [Tags.SPACE, Tags.CITY],
      cost: 25,
      victoryPoints: 3,

      metadata: {
        cardNumber: '021',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1)).nbsp.city().asterix();
        }),
        description: 'Increase your titanium production 1 step and place a City tile ON THE RESERVED AREA.',
      },
    });
  }

  public play(player: Player) {
    player.game.addCityTile(player, SpaceName.PHOBOS_SPACE_HAVEN, SpaceType.COLONY);
    player.addProduction(Resources.TITANIUM, 1);
    return undefined;
  }
}
