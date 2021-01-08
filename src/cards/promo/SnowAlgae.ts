import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class SnowAlgae implements IProjectCard {
    public name = CardName.SNOW_ALGAE;
    public cost = 12;
    public tags = [Tags.PLANT];
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      return game.checkMinRequirements(player, GlobalParameter.OCEANS, 2);
    }

    public play(player: Player) {
      player.addProduction(Resources.PLANTS);
      player.addProduction(Resources.HEAT);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '211',
      requirements: CardRequirements.builder((b) => b.oceans(2)),
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => {
          pb.plants(1).heat(1);
        });
      }),
      description: 'Requires 2 oceans. Increase your Plant production and your heat production 1 step each.',
    }
}
