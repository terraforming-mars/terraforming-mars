import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {ResourceType} from '../../ResourceType';
import {Game} from '../../Game';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Airliners implements IProjectCard {
  public cost = 11;
  public tags = [];
  public name = CardName.AIRLINERS;
  public cardType = CardType.AUTOMATED;

  public canPlay(player: Player): boolean {
    return player.getResourceCount(ResourceType.FLOATER) >= 3;
  }

  public play(player: Player, game: Game) {
    player.addProduction(Resources.MEGACREDITS, 2);
    game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {count: 2}));
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
  public metadata: CardMetadata = {
    cardNumber: 'C01',
    description: 'Requires that you have 3 floaters. Increase your MC production 2 steps. Add 2 floaters to ANY card.',
    requirements: CardRequirements.builder((b) => b.floaters(3)),
    renderData: CardRenderer.builder((b) => {
      b.production((pb) => pb.megacredits(2)).br;
      b.floaters(2).asterix();
    }),
    victoryPoints: 1,
  }
}
