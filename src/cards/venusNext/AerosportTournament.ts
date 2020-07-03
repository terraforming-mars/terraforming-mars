import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { ResourceType } from "../../ResourceType";
import { CardName } from '../../CardName';
import { Resources } from "../../Resources";
import { LogHelper } from "../../components/LogHelper";


export class AerosportTournament implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.AEROSPORT_TOURNAMENT;
    public cardType: CardType = CardType.EVENT;
    public canPlay(player: Player): boolean {
        return player.getResourceCount(ResourceType.FLOATER) >= 5;
    }
    public play(player: Player, game: Game) {
        const amount = game.getCitiesInPlay();
        player.megaCredits += amount;
        LogHelper.logGainStandardResource(game, player, Resources.MEGACREDITS, amount);
        return undefined;
    }
    
    public getVictoryPoints() {
        return 1;
    } 
}