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

export class Grass implements IProjectCard {
    public cost = 11;
    public tags = [Tags.PLANT];
    public cardType = CardType.AUTOMATED;
    public name = CardName.GRASS;
    public canPlay(player: Player, game: Game): boolean {
      return game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, -16);
    }
    public play(player: Player) {
      player.addProduction(Resources.PLANTS);
      player.plants += 3;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '087',
      requirements: CardRequirements.builder((b) => b.temperature(-16)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.plants(1)).plants(3);
      }),
      description: 'Requires -16° C or warmer. Increase your plant production 1 step. Gain 3 plants.',
    };
}
