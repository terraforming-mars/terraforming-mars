import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class GalileanMining extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.JOVIAN];
    public name: CardName = CardName.GALILEAN_MINING;
    public canPlay(player: Player) {
        return player.canAfford(5);
    }
    public play(player: Player) {
        player.setProduction(Resources.TITANIUM,2);
        player.megaCredits -= 5;
        return undefined;
    }
}

