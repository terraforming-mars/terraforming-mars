import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SelfSufficientSettlement extends PreludeCard implements IProjectCard {
    public tags = [Tags.STEEL, Tags.CITY];
    public name = CardName.SELF_SUFFICIENT_SETTLEMENT;
    public play(player: Player, game: Game) {
      player.addProduction(Resources.MEGACREDITS, 2);
      game.defer(new PlaceCityTile(player, game));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P29',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.megacredits(2)).city();
      }),
      description: 'Increase your money production 2 steps. Place a City tile.',
    }
}
