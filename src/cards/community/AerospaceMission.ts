import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class AerospaceMission extends PreludeCard {
    public tags = [Tags.SPACE];
    public name = CardName.AEROSPACE_MISSION;

    public canPlay(player: Player, _game: Game) {
      return player.canAfford(14);
    }

    public play(player: Player, game: Game) {
      player.megaCredits -= 14;
      game.defer(new BuildColony(player, game, false, 'Select where to build the first colony'));
      game.defer(new BuildColony(player, game, false, 'Select where to build the second colony'));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'Y01',
      renderData: CardRenderer.builder((b) => {
        b.colonies(1).nbsp.colonies(1).br;
        b.minus().megacredits(14);
      }),
      description: 'Place 2 colonies. Pay 14 MC.',
    }
}
