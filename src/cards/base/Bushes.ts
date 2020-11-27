
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

export class Bushes implements IProjectCard {
    public cost = 10;
    public tags = [Tags.PLANT];
    public cardType = CardType.AUTOMATED;
    public name = CardName.BUSHES;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() >= -10 - (
        2 * player.getRequirementsBonus(game)
      );
    }
    public play(player: Player) {
      player.addProduction(Resources.PLANTS, 2);
      player.plants += 2;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '093',
      description: 'Requires -10 C or warmer. Increase your plant production 2 steps. Gain 2 plants',
      requirements: CardRequirements.builder((b) => b.temperature(-10)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.plants(2);
        }).plants(2);
      }),
    };
}
