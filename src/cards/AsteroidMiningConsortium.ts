import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {Resources} from '../Resources';
import {CardName} from '../CardName';
import {DecreaseAnyProduction} from '../deferredActions/DecreaseAnyProduction';
import {CardMetadata} from '../cards/CardMetadata';
import {CardRequirements} from '../cards/CardRequirements';
import {CardRenderer} from '../cards/render/CardRenderer';

export class AsteroidMiningConsortium implements IProjectCard {
  public cost = 13;
  public tags = [Tags.JOVIAN];
  public cardType = CardType.AUTOMATED;
  public name = CardName.ASTEROID_MINING_CONSORTIUM;

  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.TITANIUM) >= 1;
  }
  public play(player: Player, game: Game) {
    game.defer(new DecreaseAnyProduction(player, game, Resources.TITANIUM, 1));
    player.addProduction(Resources.TITANIUM);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }

  public metadata: CardMetadata = {
    description: 'Requires that you have titanium production. Decrease any titanium production 1 step and increase your own 1 step.',
    cardNumber: '002',
    requirements: CardRequirements.builder((b) => b.production(Resources.TITANIUM)),
    renderData: CardRenderer.builder((b) => b.productionBox((pb) => pb.titanium(-1).any.br.plus().titanium(1))),
    victoryPoints: 1,
  };
}
