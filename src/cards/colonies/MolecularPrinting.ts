import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { Game } from "../../Game";


export class MolecularPrinting implements IProjectCard {
    public cost = 11;
    public tags = [Tags.SCIENCE];
    public name = CardName.MOLECULAR_PRINTING;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
        let coloniesCount: number = 0;
        game.colonies.forEach(colony => { 
          coloniesCount += colony.colonies.length;
        }); 
         player.megaCredits += game.getCitiesInPlay() +coloniesCount
        return undefined;
    }

    public getVictoryPoints() {
        return 1;
    }
}
