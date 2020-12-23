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

export class TundraFarming implements IProjectCard {
    public cost = 16;
    public cardType = CardType.AUTOMATED;
    public tags = [Tags.PLANT];
    public name = CardName.TUNDRA_FARMING;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() >= -6 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player) {
      player.addProduction(Resources.PLANTS);
      player.addProduction(Resources.MEGACREDITS, 2);
      player.plants++;
      return undefined;
    }
    public getVictoryPoints() {
      return 2;
    }
    public metadata: CardMetadata = {
      cardNumber: '169',
      requirements: CardRequirements.builder((b) => b.temperature(-6)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) =>{
          pb.plants(1).megacredits(2);
        }).plants(1);
      }),
      description: 'Requires -6° C or warmer. Increase your Plant production 1 step and your MC production 2 steps. Gain 1 Plant.',
      victoryPoints: 2,
    }
}
