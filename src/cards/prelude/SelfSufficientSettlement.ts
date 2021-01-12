import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {CardRenderer} from '../render/CardRenderer';

export class SelfSufficientSettlement extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.SELF_SUFFICIENT_SETTLEMENT,
      tags: [Tags.BUILDING, Tags.CITY],

      metadata: {
        cardNumber: 'P29',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).city();
        }),
        description: 'Increase your money production 2 steps. Place a City tile.',
      },
    });
  }
  public play(player: Player, game: Game) {
    player.addProduction(Resources.MEGACREDITS, 2);
    game.defer(new PlaceCityTile(player, game));
    return undefined;
  }
}
