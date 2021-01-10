import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../CardName';
import {PlaceGreeneryTile} from '../../deferredActions/PlaceGreeneryTile';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {AltSecondaryTag} from '../render/CardRenderItem';

export class ExperimentalForest extends PreludeCard {
    public tags = [Tags.PLANT];
    public name = CardName.EXPERIMENTAL_FOREST

    public play(player: Player, game: Game) {
      player.drawCard(game, {count: 2, tag: Tags.PLANT});
      game.defer(new PlaceGreeneryTile(player, game));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P12',
      renderData: CardRenderer.builder((b) => {
        b.greenery().secondaryTag(AltSecondaryTag.OXYGEN).cards(2).secondaryTag(Tags.PLANT);
      }),
      description: 'Place 1 Greenery Tile. Reveal cards until you reveal two cards with plant tags on them. Take them into your hand and discard the rest.',
    }
}

