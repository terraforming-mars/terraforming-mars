import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../common/cards/CardName';
import {PlaceGreeneryTile} from '../../deferredActions/PlaceGreeneryTile';
import {CardRenderer} from '../render/CardRenderer';

export class ExperimentalForest extends PreludeCard {
  constructor() {
    super({
      name: CardName.EXPERIMENTAL_FOREST,
      tags: [Tags.PLANT],
      metadata: {
        cardNumber: 'P12',
        renderData: CardRenderer.builder((b) => {
          b.greenery().cards(2, {secondaryTag: Tags.PLANT});
        }),
        description: 'Place 1 Greenery Tile and raise oxygen 1 step. Reveal cards until you reveal two cards with plant tags on them. Take them into your hand and discard the rest.',
      },
    });
  }
  public play(player: Player) {
    player.drawCard(2, {tag: Tags.PLANT});
    player.game.defer(new PlaceGreeneryTile(player));
    return undefined;
  }
}

