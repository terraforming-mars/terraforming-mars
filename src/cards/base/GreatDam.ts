import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class GreatDam implements IProjectCard {
    public cost = 12;
    public tags = [Tags.ENERGY, Tags.STEEL];
    public cardType = CardType.AUTOMATED;
    public name = CardName.GREAT_DAM;
    public canPlay(player: Player, game: Game): boolean {
      return game.board.getOceansOnBoard() >= 4 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
      player.addProduction(Resources.ENERGY, 2);
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '136',
      requirements: CardRequirements.builder((b) => b.oceans(4)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.energy(2));
      }),
      description: 'Requires 4 ocean tiles. Increase your Energy production 2 steps.)',
      victoryPoints: 1,
    };
}

