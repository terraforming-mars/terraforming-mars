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

export class StanfordTorus implements IProjectCard {
    public name = CardName.STANFORD_TORUS;
    public cost = 12;
    public tags = [Tags.SPACE, Tags.CITY];
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      game.addCityTile(player, SpaceName.STANFORD_TORUS, SpaceType.COLONY);
      return undefined;
    }

    public getVictoryPoints() {
      return 2;
    }

    public metadata: CardMetadata = {
      cardNumber: 'X12',
      renderData: CardRenderer.builder((b) => {
        b.city().asterix();
      }),
      description: 'Place a city tile IN SPACE, outside and separate from the planet.',
      victoryPoints: 2,
    };
}
