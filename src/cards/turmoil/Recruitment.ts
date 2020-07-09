import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { SelectParty } from "../../interrupts/SelectParty";

export class Recruitment implements IProjectCard {
    public cost: number = 2;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.RECRUITMENT;
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;
    public canPlay(player: Player, game: Game): boolean {

        if (game.turmoil !== undefined) {
            if (!game.turmoil!.hasAvailableDelegates(player.id)) {
                return false;
            }

            let parties = game.turmoil!.parties.filter(party => {
                if (party.delegates.length > 1) {
                  let delegates = party.delegates.slice();
                  delegates.splice(party.delegates.indexOf(party.partyLeader!),1);
                  return delegates.indexOf("NEUTRAL") != -1;
                } else {
                  return false;
                }
            });
            return parties.length > 0
        }
        return false;
    }

    public play(player: Player, game: Game) {
        game.addInterrupt(new SelectParty(player, game, "Select which Neutral delegate to remove", 1, "NEUTRAL", undefined, false));
        return undefined;
    }
}
