import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../SpaceType';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class GanymedeColony implements IProjectCard {
    public cost = 20;
    public tags = [Tags.JOVIAN, Tags.SPACE, Tags.CITY];
    public cardType = CardType.AUTOMATED;
    public name = CardName.GANYMEDE_COLONY;
    public getVictoryPoints(player: Player) {
      return player.getTagCount(Tags.JOVIAN, false, false);
    }
    public play(player: Player, game: Game) {
      game.addCityTile(player, SpaceName.GANYMEDE_COLONY, SpaceType.COLONY);
      return undefined;
    }
    public metadata: CardMetadata = {
      description: 'Place a city tile ON THE RESERVED AREA.',
      cardNumber: '081',
      renderData: CardRenderer.builder((b) => {
        b.city().asterix().br;
        b.text('1 VP per Jovian tag you have.', CardRenderItemSize.TINY, true);
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.jovians(1, 1),
    };
}
