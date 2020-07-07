import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';
import { PartyName } from '../../turmoil/parties/PartyName';
import { Resources } from "../../Resources";
import { SelectParty } from "../../interrupts/SelectParty";

export class MartianMediaCenter implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.MARTIAN_MEDIA_CENTER;
    public cardType: CardType = CardType.ACTIVE;

    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            return game.turmoil.canPlay(player, PartyName.MARS);
        }
        return false;
    }

    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS, 2);
        return undefined;
    }

    public canAct(player: Player, game: Game): boolean {
        return player.canAfford(3) && game.turmoil!.hasAvailableDelegates(player.id);
    }

    public action(player: Player, game: Game) {
        game.addSelectHowToPayInterrupt(player, 3, false, false, "Select how to pay for Martian Media Center action");
        game.addInterrupt(new SelectParty(player, game, "Select where to send a delegate", 1, undefined, undefined, false));
        return undefined;
    }
}
