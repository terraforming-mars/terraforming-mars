import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardMetadata} from '../../cards/CardMetadata';
import {CardRenderer} from '../../cards/render/CardRenderer';

export class GalileanMining extends PreludeCard implements IProjectCard {
    public tags = [Tags.JOVIAN];
    public name = CardName.GALILEAN_MINING;
    public canPlay(player: Player, _game: Game) {
      return player.canAfford(5);
    }
    public play(player: Player, game: Game) {
      player.addProduction(Resources.TITANIUM, 2);
      game.defer(new SelectHowToPayDeferred(player, 5, false, false));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P13',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.titanium(2);
        }).br;
        b.megacredits(-5);
      }),
      description: 'Increase your titanium production 2 steps. Pay 5 MC.',
    }
}
