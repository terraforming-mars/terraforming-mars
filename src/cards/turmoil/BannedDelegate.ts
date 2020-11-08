import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player, PlayerId } from "../../Player";
import { Game } from "../../Game";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectDelegate } from "../../inputs/SelectDelegate";
import { IParty } from "../../turmoil/parties/IParty";

export class BannedDelegate implements IProjectCard {
    public cost = 0;
    public tags = [];
    public name = CardName.BANNED_DELEGATE;
    public cardType = CardType.EVENT;

    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            return game.turmoil.chairman === player.id
        }
        return false;
    }

    public play(player: Player, game: Game) {
        let orOptions = new Array<SelectDelegate>();
        // Take each party having more than just the party leader in the area
        game.turmoil!.parties.forEach(party => {
          if(party.delegates.length > 1) {
            // Remove the party leader from available choices
            const delegates = party.delegates.slice();
            delegates.splice(party.delegates.indexOf(party.partyLeader!),1);
            const playersId = Array.from(new Set<PlayerId | "NEUTRAL">(delegates));
            let players = new Array<Player | "NEUTRAL">();
            playersId.forEach(playerId => {
              if (playerId === "NEUTRAL") {
                players.push("NEUTRAL");
              } else {
                players.push(game.getPlayerById(playerId));
              }  
            });

            if (players.length > 0) {
              let selectDelegate = new SelectDelegate(players, "Select player delegate to remove from " + party.name + " party", (selectedPlayer: Player | "NEUTRAL") => {
                let playerToRemove = "";
                if (selectedPlayer === "NEUTRAL") {
                  playerToRemove = "NEUTRAL";
                } else {
                  playerToRemove = selectedPlayer.id;
                }
                game.turmoil!.removeDelegateFromParty(playerToRemove, party.name, game);
                this.log(game, player, party);
                return undefined;
              });
              selectDelegate.buttonLabel = "Remove delegate";
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

    private log(game: Game, player: Player, party: IParty) {
      game.log("${0} removed a delegate from ${1}", b => b.player(player).party(party));
    }
}