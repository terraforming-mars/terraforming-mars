import {IActionCard} from '../ICard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';

export class SeptumTribus implements IActionCard, CorporationCard {
    public name = CardName.SEPTUM_TRIBUS;
    public tags = [Tags.WILDCARD];
    public startingMegaCredits: number = 36;
    public cardType = CardType.CORPORATION;
    public play() {
      return undefined;
    }

    public canAct(_player: Player, game: Game): boolean {
      return game.gameOptions.turmoilExtension;
    }

    public action(player: Player, game: Game) {
      if (game.turmoil !== undefined) {
        const partiesWithPresence = game.turmoil.parties.filter((party) => party.delegates.includes(player.id));
        player.megaCredits += partiesWithPresence.length * 2;
      }

      return undefined;
    }
}
