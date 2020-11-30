import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';

export class MethaneFromTitan implements IProjectCard {
    public cost = 28;
    public tags = [Tags.JOVIAN, Tags.SPACE];
    public name = CardName.METHANE_FROM_TITAN;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 2 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
      player.addProduction(Resources.HEAT, 2);
      player.addProduction(Resources.PLANTS, 2);
      return undefined;
    }
    public getVictoryPoints() {
      return 2;
    }
    public metadata: CardMetadata = {
      description: 'Requires 2% oxygen. Increase your heat production 2 steps and your plant production 2 steps.',
      cardNumber: '018',
      requirements: CardRequirements.builder((b) => b.oxygen(2)),
      renderData: CardRenderer.builder((b) => b.productionBox((pb) => {
        pb.plus().heat(2).br;
        pb.plus().plants(2);
      })),
      victoryPoints: 2,
    };
}
