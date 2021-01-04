import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../SpaceType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class GanymedeColony extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GANYMEDE_COLONY,
      tags: [Tags.JOVIAN, Tags.SPACE, Tags.CITY],
      cost: 20,

      metadata: {
        description: 'Place a city tile ON THE RESERVED AREA.',
        cardNumber: '081',
        renderData: CardRenderer.builder((b) => {
          b.city().asterix().br;
          b.text('1 VP per Jovian tag you have.', CardRenderItemSize.TINY, true);
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.jovians(1, 1),
      },
    });
  }
  public getVictoryPoints(player: Player) {
    return player.getTagCount(Tags.JOVIAN, false, false);
  }
  public play(player: Player, game: Game) {
    game.addCityTile(player, SpaceName.GANYMEDE_COLONY, SpaceType.COLONY);
    return undefined;
  }
}
