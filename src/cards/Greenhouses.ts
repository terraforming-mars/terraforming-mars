
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';
import { LogHelper } from "../components/LogHelper";
import { Resources } from "../Resources";

export class Greenhouses implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.PLANT, Tags.STEEL];
    public name: CardName = CardName.GREENHOUSES;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
        const qty = game.getCitiesInPlay();
        player.plants += qty;
        LogHelper.logGainStandardResource(game, player, Resources.PLANTS, qty);
        return undefined;
    }
}
