import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class RadSuits implements IProjectCard {
    public cost = 6;
    public tags = [];
    public cardType = CardType.AUTOMATED;
    public name = CardName.RAD_SUITS;
    public canPlay(_player: Player, game: Game): boolean {
      return game.getCitiesInPlay() >= 2;
    }
    public play(player: Player, game: Game) {
      if (game.getCitiesInPlay() < 2) {
        throw 'Must have 2 cities in play';
      }
      player.addProduction(Resources.MEGACREDITS);
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '186',
      requirements: CardRequirements.builder((b) => b.cities(2)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.megacredits(1));
      }),
      description: 'Requires two cities in play. Increase your MC up 1 step.',
      victoryPoints: 1,
    }
}
