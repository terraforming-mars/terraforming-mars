import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../SpaceType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class GanymedeColony extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GANYMEDE_COLONY,
      tags: [Tags.JOVIAN, Tags.SPACE, Tags.CITY],
      cost: 20,

      victoryPoints: VictoryPoints.tags(Tags.JOVIAN, 1, 1),

      metadata: {
        description: 'Place a city tile ON THE RESERVED AREA.',
        cardNumber: '081',
        renderData: CardRenderer.builder((b) => {
          b.city().asterix().br;
          b.vpText('1 VP per Jovian tag you have.');
        }),
      },
    });
  }
  public play(player: Player) {
    player.game.addCityTile(player, SpaceName.GANYMEDE_COLONY, SpaceType.COLONY);
    return undefined;
  }
}
