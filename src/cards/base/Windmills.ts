import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PlayerInput} from '../../PlayerInput';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Windmills implements IProjectCard {
    public cost = 6;
    public tags = [Tags.ENERGY, Tags.BUILDING];
    public name = CardName.WINDMILLS;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 7 - player.getRequirementsBonus(game);
    }
    public play(player: Player): PlayerInput | undefined {
      player.addProduction(Resources.ENERGY);
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '168',
      requirements: CardRequirements.builder((b) => b.oxygen(7)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.energy(1));
      }),
      description: 'Requires 7% oxygen. Increase your Energy production 1 step.',
      victoryPoints: 1,
    }
}
