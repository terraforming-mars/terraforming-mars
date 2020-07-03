import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import { Resources } from '../Resources';
import { CardName } from '../CardName';
import { LogMessageType } from '../LogMessageType';
import { LogMessageData } from '../LogMessageData';
import { LogMessageDataType } from '../LogMessageDataType';

export class ElectroCatapult implements IActionCard, IProjectCard {
    public cost: number = 17;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.ELECTRO_CATAPULT;
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(player: Player, game: Game): boolean {
      return player.getProduction(Resources.ENERGY) >= 1 &&
        game.getOxygenLevel() <= 8 + player.getRequirementsBonus(game);
    }
    public canAct(player: Player): boolean {
      return player.plants > 0 || player.steel > 0;
    }
    public action(player: Player, game: Game) {
      if (player.plants > 0 && player.steel > 0) {
        return new OrOptions(
            new SelectOption('Spend 1 plant to gain 7 mega credit', () => {
              player.plants--;
              player.megaCredits += 7;
              this.log(game, player, Resources.PLANTS);
              return undefined;
            }),
            new SelectOption('Spend 1 steel to gain 7 mega credit', () => {
              player.steel--;
              player.megaCredits += 7;
              this.log(game, player, Resources.STEEL);
              return undefined;
            })
        );
      } else if (player.plants > 0) {
        player.plants--;
        this.log(game, player, Resources.PLANTS);
        player.megaCredits += 7;
      } else if (player.steel > 0) {
        player.steel--;
        this.log(game, player, Resources.STEEL);
        player.megaCredits += 7;
      }
      return undefined;
    }
    public play(player: Player) {
      player.setProduction(Resources.ENERGY,-1);
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    
    private log(game: Game, player: Player, resource: Resources) {
      game.log(
        LogMessageType.DEFAULT,
        "${0} spent 1 ${1} to gain 7 MC",
        new LogMessageData(LogMessageDataType.PLAYER, player.id),
        new LogMessageData(LogMessageDataType.STRING, resource)
      );
    }
}
