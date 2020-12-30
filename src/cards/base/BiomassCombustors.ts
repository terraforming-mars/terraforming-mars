import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';

export class BiomassCombustors implements IProjectCard {
  public cost = 4;
  public cardType = CardType.AUTOMATED;
  public tags = [Tags.ENERGY, Tags.BUILDING];
  public name = CardName.BIOMASS_COMBUSTORS;
  public canPlay(player: Player, game: Game): boolean {
    return game.getOxygenLevel() >= 6 - player.getRequirementsBonus(game) && game.someoneHasResourceProduction(Resources.PLANTS, 1);
  }

  public play(player: Player, game: Game) {
    player.addProduction(Resources.ENERGY, 2);
    game.defer(new DecreaseAnyProduction(player, game, Resources.PLANTS, 1));
    return undefined;
  }
  public getVictoryPoints() {
    return -1;
  }
  public metadata: CardMetadata = {
    description: 'Requires 6% oxygen. Decrease any Plant production 1 step and increase your Energy production 2 steps.',
    cardNumber: '183',
    requirements: CardRequirements.builder((b) => b.oxygen(6)),
    renderData: CardRenderer.builder((b) => {
      b.productionBox((pb) => {
        pb.minus().plants(-1).any.br;
        pb.energy(2);
      });
    }),
    victoryPoints: -1,
  };
}
