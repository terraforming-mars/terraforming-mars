import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PartyName} from '../../turmoil/parties/PartyName';


export class EventAnalysts implements IProjectCard {
    public cost = 5;
    public tags = [Tags.SCIENCE];
    public name = CardName.EVENT_ANALYSTS;
    public cardType = CardType.ACTIVE;

    public canPlay(player: Player, game: Game): boolean {
      if (game.turmoil !== undefined) {
        return game.turmoil.canPlay(player, PartyName.SCIENTISTS);
      }
      return false;
    }

    public play(player: Player, game: Game) {
      if (game.turmoil) {
        game.turmoil.addInfluenceBonus(player);
      }
      return undefined;
    }
}
