import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PartyName } from "../../turmoil/parties/PartyName";
import { Resources } from "../../Resources";


export class GMOContract implements IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.MICROBES, Tags.SCIENCE];
    public name: CardName = CardName.GMO_CONTRACT;
    public cardType: CardType = CardType.ACTIVE;

    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            return game.turmoil.canPlay(player, PartyName.GREENS);
        }
        return false;
    }

    public onCardPlayed(player: Player, _game: Game, card: IProjectCard): void {
        let amount = card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT || tag === Tags.MICROBES).length;
        if (amount > 0) {
            player.setResource(Resources.MEGACREDITS, amount * 2);
        }
    }

    public play() {
        return undefined;
    }
}