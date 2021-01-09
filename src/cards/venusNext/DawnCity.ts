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
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class DawnCity implements IProjectCard {
    public cost = 15;
    public tags = [Tags.CITY, Tags.SPACE];
    public name = CardName.DAWN_CITY;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 4 && player.getProduction(Resources.ENERGY) >= 1;
    }
    public play(player: Player, game: Game) {
      player.addProduction(Resources.ENERGY, -1);
      player.addProduction(Resources.TITANIUM);
      game.addCityTile(player, SpaceName.DAWN_CITY, SpaceType.COLONY);
      return undefined;
    }
    public getVictoryPoints() {
      return 3;
    }
    public metadata: CardMetadata = {
      cardNumber: '220',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 4)),
      description: 'Requires 4 Science tags. Decrease your energy production 1 step. Increase your titanium production 1 step. Place a City tile on the RESERVED AREA.',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => {
          pb.minus().energy(1).br;
          pb.plus().titanium(1);
        }).nbsp.city().asterix();
      }),
      victoryPoints: 3,
    }
}
