
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";

export class SpaceStation implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Space Station";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "When you play a space card, you pay 2 mega credits less for it. Gain 1 victory point.";
    public description: string = "Buy it today at www.fryxgames.se";
    public canPlay(): boolean {
        return true;
    }
    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.SPACE) !== -1) {
            return 2;
        }
        return 0;
    }
    public play(player: Player, _game: Game) {
        player.victoryPoints++;
        return undefined;
    }
}
    
