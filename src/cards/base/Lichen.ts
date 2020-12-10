import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Lichen implements IProjectCard {
    public cost = 7;
    public tags = [Tags.PLANT];
    public name = CardName.LICHEN;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() >= -24 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player) {
      player.addProduction(Resources.PLANTS);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '159',
      requirements: CardRequirements.builder((b) => b.temperature(-24)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.plants(1));
      }),
      description: 'Requires -24 C or warmer. Increase your Plant production 1 step.',
    }
}

