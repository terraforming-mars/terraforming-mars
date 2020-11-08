import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Resources } from "../../Resources";
import { BuildColony } from "../../deferredActions/BuildColony";

export class PioneerSettlement implements IProjectCard {
    public cost = 13;
    public tags = [Tags.SPACE];
    public name = CardName.PIONEER_SETTLEMENT;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        let coloniesCount: number = 0;
        game.colonies.forEach(colony => { 
            coloniesCount += colony.colonies.filter(owner => owner === player.id).length;
        }); 
        return coloniesCount < 2;
    }

    public play(player: Player, game: Game) {
        game.defer(new BuildColony(player, game, false, "Select colony for Pioneer Settlement"));
        player.addProduction(Resources.MEGACREDITS, -2); 
        return undefined;
    }

    public getVictoryPoints() {
        return 2;
    }
}
