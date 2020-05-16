import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class GiantIceAsteroid implements IProjectCard {
    public cost: number = 36;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.GIANT_ICE_ASTEROID;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, game: Game) {
        game.increaseTemperature(player, 2);
        game.addOceanInterrupt(player, "Select space for first ocean");
        game.addOceanInterrupt(player, "Select space for second ocean");
        game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 6);
        return undefined;
    }
}
