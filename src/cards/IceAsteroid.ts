
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class IceAsteroid implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Ice Asteroid";

    public static placeTwoOceans(player: Player, game: Game): SelectSpace | undefined {
        let available = game.board.getAvailableSpacesForOcean(player);
        if (available.length === 0 || game.noOceansAvailable()) {
            return undefined;
        }
        return new SelectSpace("Select space for first ocean tile", available, (space: ISpace) => {
            game.addOceanTile(player, space.id);
            available = game.board.getAvailableSpacesForOcean(player);
            if (available.length === 0 || game.noOceansAvailable()) {
                return undefined;
            }
            return new SelectSpace("Select space for second ocean tile", available, (space: ISpace) => {
                game.addOceanTile(player, space.id);
                return undefined;
            });
        });
    }
    public play: (player: Player, game: Game) => SelectSpace | undefined = IceAsteroid.placeTwoOceans;
}
