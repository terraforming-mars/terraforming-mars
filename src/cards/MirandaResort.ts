
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class MirandaResort implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: string = "Miranda Resort";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your mega credit production 1 step for each Earth tag you have. Gain 1 victory point.";
    public description: string = "Situated on Verona Rupes, the highest vertical drop in the solar system, the resort attracts many of the thrill-seekers among the rich on Earth";
    public play(player: Player, _game: Game) {
        player.victoryPoints++;
        player.megaCreditProduction += player.getTagCount(Tags.EARTH);
        return undefined;
    }
}
