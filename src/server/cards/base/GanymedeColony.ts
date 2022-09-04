import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../../common/boards/SpaceType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class GanymedeColony extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GANYMEDE_COLONY,
      tags: [Tag.JOVIAN, Tag.SPACE, Tag.CITY],
      cost: 20,

      victoryPoints: VictoryPoints.tags(Tag.JOVIAN, 1, 1),

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
  public override bespokePlay(player: Player) {
    player.game.addCityTile(player, SpaceName.GANYMEDE_COLONY, SpaceType.COLONY);
    return undefined;
  }
}
