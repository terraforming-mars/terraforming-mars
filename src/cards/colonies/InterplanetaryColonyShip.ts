import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {BuildColony} from '../../deferredActions/BuildColony';

export class InterplanetaryColonyShip implements IProjectCard {
    public cost = 12;
    public tags = [Tags.SPACE, Tags.EARTH];
    public name = CardName.INTERPLANETARY_COLONY_SHIP;
    public cardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
      return player.hasAvailableColonyTileToBuildOn(game);
    }

    public play(player: Player, game: Game) {
      game.defer(new BuildColony(player, game, false, 'Select colony for Interplanetary Colony Ship'));
      return undefined;
    }
}
