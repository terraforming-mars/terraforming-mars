import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class KelpFarming implements IProjectCard {
    public cost = 17;
    public tags = [Tags.PLANT];
    public name = CardName.KELP_FARMING;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.board.getOceansOnBoard() >= 6 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 2);
      player.addProduction(Resources.PLANTS, 3);
      player.plants += 2;
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '055',
      requirements: CardRequirements.builder((b) => b.oceans(6)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.megacredits(2).br;
          pb.plants(3);
        }).nbsp.plants(2);
      }),
      description: 'Requires 6 ocean tiles. Increase your MC production 2 steps and your Plant production 3 steps. Gain 2 Plants.',
      victoryPoints: 1,
    };
}
