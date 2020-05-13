import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Game } from '../../Game';


export class MolecularPrinting implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: CardName = CardName.MOLECULAR_PRINTING;
    public cardType: CardType = CardType.AUTOMATED;

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
