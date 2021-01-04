import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class GreatAquifer extends PreludeCard {
    public tags = [];
    public name = CardName.GREAT_AQUIFER;

    public play(player: Player, game: Game) {
      game.defer(new PlaceOceanTile(player, game, 'Select space for first ocean'));
      game.defer(new PlaceOceanTile(player, game, 'Select space for second ocean'));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P13',
      renderData: CardRenderer.builder((b) => {
        b.oceans(2);
      }),
      description: 'Place 2 Ocean tiles.',
    }
}

