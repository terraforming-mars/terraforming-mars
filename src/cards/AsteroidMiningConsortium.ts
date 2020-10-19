import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { DecreaseAnyProduction } from "../deferredActions/DecreaseAnyProduction";

export class AsteroidMiningConsortium implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.JOVIAN];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.ASTEROID_MINING_CONSORTIUM;

    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.TITANIUM) >= 1 ;
    }
    public play(player: Player, game: Game) {
        game.defer(new DecreaseAnyProduction(player, game, Resources.TITANIUM, 1));
        player.addProduction(Resources.TITANIUM);
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
