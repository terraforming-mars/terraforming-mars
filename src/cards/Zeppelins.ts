
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class Zeppelins implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.ZEPPELINS;
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 5 - player.getRequirementsBonus(game);
    }
    public play(player: Player, game: Game) {
        player.addProduction(Resources.MEGACREDITS, game.getCitiesInPlayOnMars());
        return undefined; 
    }
    public getVictoryPoints() {
        return 1;
    }
}

