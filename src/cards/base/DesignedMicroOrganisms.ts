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

export class DesignedMicroOrganisms implements IProjectCard {
    public cost = 16;
    public tags = [Tags.SCIENCE, Tags.MICROBES];
    public name = CardName.DESIGNED_MICRO_ORGANISMS;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() <= -14 + (
        2 * player.getRequirementsBonus(game)
      );
    }
    public play(player: Player) {
      player.addProduction(Resources.PLANTS, 2);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '155',
      description: 'It must be -14 C or colder. Increase your Plant production 2 steps.',
      requirements: CardRequirements.builder((b) => b.temperature(-14).max()),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.plants(2));
      }),
    }
}
