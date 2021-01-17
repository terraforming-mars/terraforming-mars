import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

export class GreatAquifer extends PreludeCard {
  constructor() {
    super({
      name: CardName.GREAT_AQUIFER,

      metadata: {
        cardNumber: 'P13',
        renderData: CardRenderer.builder((b) => {
          b.oceans(2);
        }),
        description: 'Place 2 Ocean tiles.',
      },
    });
  }
  public play(player: Player, game: Game) {
    game.defer(new PlaceOceanTile(player, 'Select space for first ocean'));
    game.defer(new PlaceOceanTile(player, 'Select space for second ocean'));
    return undefined;
  }
}

