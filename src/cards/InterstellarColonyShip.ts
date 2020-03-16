
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';

export class InterstellarColonyShip implements IProjectCard {
    public cost: number = 24;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: string = CardName.INTERSTELLAR_COLONY_SHIP;
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 5;
    }
    public play(player: Player, _game: Game) {
        if (player.getTagCount(Tags.SCIENCE) < 5) {
            throw "Requires 5 science tags.";
        }
        return undefined;
    }
    public getVictoryPoints() {
        return 4;
    }
}
