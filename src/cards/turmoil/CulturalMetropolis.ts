import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { Game } from '../../Game';
import { PartyName } from '../../turmoil/parties/PartyName';
import { SelectCity } from "../../interrupts/SelectCity";
import { SelectParty } from "../../interrupts/SelectParty";


export class CulturalMetropolis implements IProjectCard {
    public cost: number = 20;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public name: CardName = CardName.CULTURAL_METROPOLIS;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            return game.turmoil.canPlay(player, PartyName.UNITY) && player.getProduction(Resources.ENERGY) >= 1;
        }
        return false;
    }

    public play(player: Player, game: Game) {
        player.setProduction(Resources.ENERGY,-1);
        player.setProduction(Resources.MEGACREDITS,3);
        game.addInterrupt(new SelectCity(player, game));
        game.addInterrupt(new SelectParty(player, game, "Select where to send two delegates", 2));
        return undefined;
    }
}