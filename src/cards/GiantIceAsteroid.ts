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
    public name: string = CardName.GIANT_ICE_ASTEROID;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, game: Game) {
        game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 6);
        game.addOceanInterrupt(player, "Select space for first ocean");
        game.addOceanInterrupt(player, "Select space for second ocean");
        return game.increaseTemperature(player, 2);
    }
}
