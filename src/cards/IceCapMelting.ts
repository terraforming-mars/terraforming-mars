
import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { Player } from "../Player";
import { Game } from "../Game";
import { Tags } from "./Tags";
import { CardName } from '../CardName';

export class IceCapMelting implements IProjectCard {
    public cost: number = 5;
    public cardType: CardType = CardType.EVENT;
    public tags: Array<Tags> = [];
    public name: string = CardName.ICE_CAP_MELTING;
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= 2 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player, game: Game) {
        game.addOceanInterrupt(player);
        return undefined;
    }
}
