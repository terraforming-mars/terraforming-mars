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

export class PhobosSpaceHaven implements IProjectCard {
    public cost = 25;
    public tags = [Tags.SPACE, Tags.CITY];
    public name = CardName.PHOBOS_SPACE_HAVEN;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      game.addCityTile(player, SpaceName.PHOBOS_SPACE_HAVEN, SpaceType.COLONY);
      player.addProduction(Resources.TITANIUM);
      return undefined;
    }
    public getVictoryPoints() {
      return 3;
    }
    public metadata: CardMetadata = {
      cardNumber: '021',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.titanium(1)).nbsp.city();
      }),
      description: 'Increase your titanium production 1 step and place a City tile ON THE RESERVED AREA.',
      victoryPoints: 3,
    }
}
