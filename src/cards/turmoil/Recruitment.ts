import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';
import { SelectParty } from "../../interrupts/SelectParty";

export class Recruitment implements IProjectCard {
    public cost: number = 2;
    public tags: Array<Tags> = [Tags.EVENT];
    public name: CardName = CardName.RECRUITMENT;
    public cardType: CardType = CardType.EVENT;

    public canPlay(_player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            let parties = game.turmoil!.parties.filter(party => 
                party.delegates.length > 1 && 
                party.delegates.splice(party.delegates.indexOf(party.partyLeader!),1).indexOf("NEUTRAL") != -1
            );
            return parties.length > 0
        }
        return false;
    }

    public play(player: Player, game: Game) {
        game.addInterrupt(new SelectParty(player, game, "Select which Neutral delegate to remove", 1, "NEUTRAL"));
        return undefined;
    }
}