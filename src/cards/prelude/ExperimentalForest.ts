import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../CardName';
import {PlaceGreeneryTile} from '../../deferredActions/PlaceGreeneryTile';
import {CardRenderer} from '../render/CardRenderer';
import {AltSecondaryTag} from '../render/CardRenderItem';

export class ExperimentalForest extends PreludeCard {
  constructor() {
    super({
      name: CardName.EXPERIMENTAL_FOREST,
      tags: [Tags.PLANT],
      metadata: {
        cardNumber: 'P12',
        renderData: CardRenderer.builder((b) => {
          b.greenery().secondaryTag(AltSecondaryTag.OXYGEN).cards(2).secondaryTag(Tags.PLANT);
        }),
        description: 'Place 1 Greenery Tile. Reveal cards until you reveal two cards with plant tags on them. Take them into your hand and discard the rest.',
      },
    });
  }
  public play(player: Player, game: Game) {
    player.drawCard(2, {tag: Tags.PLANT});
    game.defer(new PlaceGreeneryTile(player));
    return undefined;
  }
}

