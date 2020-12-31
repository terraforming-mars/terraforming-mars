
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

export class Farming implements IProjectCard {
  public cost = 16;
  public tags = [Tags.PLANT];
  public name = CardName.FARMING;
  public cardType = CardType.AUTOMATED;
  public canPlay(player: Player, game: Game): boolean {
    return game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, 4);
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 2);
    player.addProduction(Resources.PLANTS, 2);
    player.plants += 2;
    return undefined;
  }
  public getVictoryPoints() {
    return 2;
  }
  public metadata: CardMetadata = {
    cardNumber: '118',
    requirements: CardRequirements.builder((b) => b.temperature(4)),
    description: 'Requires +4° C or warmer. Increase your MC production 2 steps and your plant production 2 steps. Gain 2 Plants.',
    renderData: CardRenderer.builder((b) => {
      b.productionBox((pb) => {
        pb.megacredits(2).br;
        pb.plants(2);
      }).nbsp.plants(2);
    }),
    victoryPoints: 2,
  }
}
