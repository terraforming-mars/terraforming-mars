
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';

export class IceAsteroid implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.ICE_ASTEROID;

    public play(player: Player, game: Game) {
        game.addOceanInterrupt(player, "Select space for first ocean");
        game.addOceanInterrupt(player, "Select space for second ocean");
        return undefined;
    }
}
