import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../common/cards/CardName';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class SelfSufficientSettlement extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.SELF_SUFFICIENT_SETTLEMENT,
      tags: [Tags.BUILDING, Tags.CITY],
      productionBox: Units.of({megacredits: 2}),

      metadata: {
        cardNumber: 'P29',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).city();
        }),
        description: 'Increase your money production 2 steps. Place a City tile.',
      },
    });
  }
  public play(player: Player) {
    player.adjustProduction(this.productionBox);
    player.game.defer(new PlaceCityTile(player));
    return undefined;
  }
}
