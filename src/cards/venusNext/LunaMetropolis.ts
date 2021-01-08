import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../SpaceType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class LunaMetropolis implements IProjectCard {
    public cost = 21;
    public tags = [Tags.CITY, Tags.SPACE, Tags.EARTH];
    public name = CardName.LUNA_METROPOLIS;
    public cardType = CardType.AUTOMATED;
    public play(player: Player, game: Game) {
      player.addProduction(Resources.MEGACREDITS, player.getTagCount(Tags.EARTH) + 1);
      game.addCityTile(player, SpaceName.LUNA_METROPOLIS, SpaceType.COLONY);
      return undefined;
    }
    public getVictoryPoints() {
      return 2;
    }
    public metadata: CardMetadata = {
      cardNumber: '236',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.megacredits(1).slash().earth().played).br;
        b.city().asterix();
      }),
      description: 'Increase your MC production 1 step for each Earth tag you have, including this. Place a City tile on the RESERVED AREA',
      victoryPoints: 2,
    };
}
