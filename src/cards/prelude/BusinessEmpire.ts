import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class BusinessEmpire extends PreludeCard {
    public tags = [Tags.EARTH];
    public name = CardName.BUSINESS_EMPIRE;
    public canPlay(player: Player, _game: Game) {
      if (player.isCorporation(CardName.MANUTECH)) return true;
      return player.canAfford(6);
    }
    public play(player: Player, game: Game) {
      player.addProduction(Resources.MEGACREDITS, 6);
      game.defer(new SelectHowToPayDeferred(player, 6, false, false));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P06',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.megacredits(6)).br;
        b.megacredits(-6);
      }),
      description: 'Increase your MC production 6 steps. Pay 6 MC.',
    }
}

