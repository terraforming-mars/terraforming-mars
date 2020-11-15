import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {BuildColony} from '../../deferredActions/BuildColony';

export class TradingColony implements IProjectCard {
    public cost = 18;
    public tags = [Tags.SPACE];
    public name = CardName.TRADING_COLONY;
    public cardType = CardType.ACTIVE;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
      return player.hasAvailableColonyTileToBuildOn(game);
    }

    public play(player: Player, game: Game) {
      game.defer(new BuildColony(player, game, false, 'Select colony for Trading Colony'));
      player.colonyTradeOffset++;
      return undefined;
    }

    public onDiscard(player: Player): void {
      player.colonyTradeOffset--;
    }
}
