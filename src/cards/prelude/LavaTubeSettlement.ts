
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { SelectSpace } from "../../inputs/SelectSpace";
import { LavaFlows } from "../LavaFlows";
import { ISpace } from "../../ISpace";

export class LavaTubeSettlement implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.STEEL, Tags.CITY];
    public name: string = "Lava Tube Settlement";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return LavaFlows.getVolcanicSpaces(player, game).length > 0 && player.energyProduction >= 1;
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select either Tharsis Tholus, Ascraeus Mons, Pavonis Mons or Arsia Mons", LavaFlows.getVolcanicSpaces(player, game), (space: ISpace) => {
            game.addCityTile(player, space.id);
            player.megaCreditProduction += 2;
            player.energyProduction--;
            return undefined;
        });
    }
}
