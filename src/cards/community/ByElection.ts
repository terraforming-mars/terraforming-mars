import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "../prelude/PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { CardName } from '../../CardName';
import { Game } from "../../Game";
import { ALL_PARTIES } from "../../turmoil/Turmoil";
import { SelectOption } from "../../inputs/SelectOption";
import { OrOptions } from "../../inputs/OrOptions";

export class ByElection extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.WILDCARD];
    public name: CardName = CardName.BY_ELECTION;

    public play(player: Player, game: Game) {
        game.turmoil!.addInfluenceBonus(player);
        const setRulingParty = new OrOptions();
            
        setRulingParty.title = "Select new ruling party";
        setRulingParty.options = [...ALL_PARTIES.map((p) => new SelectOption(
            p.partyName, "Select", () => {
            game.turmoil!.rulingParty = game.turmoil!.getPartyByName(p.partyName);
            return undefined;
            })
        )];

        game.addInterrupt({ player, playerInput: setRulingParty });

        return undefined;
    }
}