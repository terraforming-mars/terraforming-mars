import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { CardName } from '../../CardName';

export class UNMIContractor extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = CardName.UNMI_CONTRACTOR;
    public play(player: Player, game: Game) {
        player.terraformRating += 3;
	      player.cardsInHand.push(game.dealer.dealCard());
	      return undefined;   
    }
}

