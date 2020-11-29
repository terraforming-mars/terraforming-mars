import {Player} from '../../Player';
import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';

export class SpaceMirrors implements IActionCard, IProjectCard {
    public cost = 3;
    public tags = [Tags.ENERGY, Tags.SPACE];
    public name = CardName.SPACE_MIRRORS;
    public cardType = CardType.ACTIVE;

    public play() {
      return undefined;
    }
    public canAct(player: Player): boolean {
      return player.canAfford(7);
    }
    public action(player: Player, game: Game) {
      game.defer(new SelectHowToPayDeferred(player, 7, false, false, 'Select how to pay for action'));
      player.addProduction(Resources.ENERGY);
      return undefined;
    }
}
