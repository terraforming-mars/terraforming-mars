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

export class Heather implements IProjectCard {
    public cost = 6;
    public tags = [Tags.PLANT];
    public name = CardName.HEATHER;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() >= -14 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player) {
      player.addProduction(Resources.PLANTS);
      player.plants++;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '178',
      requirements: CardRequirements.builder((b) => b.temperature(-14)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.plants(1)).plants(1);
      }),
      description: 'Requires -14 C° or warmer. Increase your plant production 1 step. Gain 1 plant.',
    };
}
