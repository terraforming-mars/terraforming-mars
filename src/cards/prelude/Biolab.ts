import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class Biolab extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: CardName = CardName.BIOLAB;
    public play(player: Player, game: Game) {
        player.addProduction(Resources.PLANTS);
		for (let i = 0; i < 3; i++) {
		    player.cardsInHand.push(game.dealer.dealCard());
		}
        return undefined;
    }
}

