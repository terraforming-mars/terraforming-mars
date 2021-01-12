import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

export class PolarIndustries extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.POLAR_INDUSTRIES,
      tags: [Tags.BUILDING],

      metadata: {
        cardNumber: 'P26',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(2)).br;
          b.oceans(1);
        }),
        description: 'Increase your heat production 2 steps. Place an Ocean tile.',
      },
    });
  }
  public play(player: Player, game: Game) {
    game.defer(new PlaceOceanTile(player, game));
    player.addProduction(Resources.HEAT, 2);
    return undefined;
  }
}
