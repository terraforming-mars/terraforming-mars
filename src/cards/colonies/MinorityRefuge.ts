import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MinorityRefuge implements IProjectCard {
    public cost = 5;
    public tags = [Tags.SPACE];
    public name = CardName.MINORITY_REFUGE;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      return player.hasAvailableColonyTileToBuildOn(game) && player.getProduction(Resources.MEGACREDITS) >= -3;
    }

    public play(player: Player, game: Game) {
      game.defer(new BuildColony(player, false, 'Select colony for Minority Refuge'));
      player.addProduction(Resources.MEGACREDITS, -2);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'C26',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.megacredits(-2)).colonies(1);
      }),
      description: 'Decrease your MC production 2 steps. Place a colony.',
    }
}
