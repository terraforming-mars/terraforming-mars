import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class PolarIndustries extends PreludeCard implements IProjectCard {
    public tags = [Tags.BUILDING];
    public name = CardName.POLAR_INDUSTRIES;
    public play(player: Player, game: Game) {
      game.defer(new PlaceOceanTile(player, game));
      player.addProduction(Resources.HEAT, 2);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P26',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.heat(2)).br;
        b.oceans(1);
      }),
      description: 'Increase your heat production 2 steps. Place an Ocean tile.',
    }
}
