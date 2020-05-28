import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';
import { OrOptions } from "../../inputs/OrOptions";
import { SelectDelegate } from "../../inputs/SelectDelegate";

export class BannedDelegate implements IProjectCard {
    public cost: number = 0;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.BANNED_DELEGATE;
    public cardType: CardType = CardType.EVENT;

    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            return game.turmoil.chairman === player
        }
        return false;
    }

    public play(_player: Player, game: Game) {
        let orOptions = new Array<SelectDelegate>();
        // Take each party having more than just the party leader in the area
        game.turmoil!.parties.forEach(party => {
          if(party.delegates.length > 1) {
            // Remove the party leader from available choices
            const delegates = party.delegates.slice();
            delegates.splice(party.delegates.indexOf(party.partyLeader!),1);
            const players = Array.from(new Set<Player | "NEUTRAL">(delegates));
            if (players.length > 0) {
              let selectDelegate = new SelectDelegate(players, "Select player delegate to remove from " + party.name + " party", (selectedPlayer: Player | "NEUTRAL") => {
                game.turmoil!.removeDelegateFromParty(selectedPlayer, party.name, game);   
                return undefined;
              });
              orOptions.push(selectDelegate);
            }
          }
        });
        if (orOptions.length === 0) {
          return undefined;
        } else if (orOptions.length === 1) {
          return orOptions[0];
        } else {
          let options = new OrOptions(...orOptions);   
          return options;
        }
    }
}