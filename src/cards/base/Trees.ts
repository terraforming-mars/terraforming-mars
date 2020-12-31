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
import {GlobalParameter} from '../../GlobalParameter';

export class Trees implements IProjectCard {
    public cost = 13;
    public tags = [Tags.PLANT];
    public name = CardName.TREES;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, -4);
    }
    public play(player: Player) {
      player.addProduction(Resources.PLANTS, 3);
      player.plants++;
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '060',
      requirements: CardRequirements.builder((b) => b.temperature(-4)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.plants(3)).plants(1);
      }),
      description: 'Requires -4 C or warmer. Increase your Plant production 3 steps. Gain 1 Plant.',
      victoryPoints: 1,
    }
}
