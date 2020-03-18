import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class AquiferTurbines extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: CardName = CardName.AQUIFER_TURBINES;
    public canPlay(player: Player) {
        return player.canAfford(3);
    }
    public play(player: Player, game: Game) {
        player.setProduction(Resources.ENERGY,2);
        player.megaCredits -= 3;
        game.addOceanInterrupt(player);
        return undefined;
    }
}

