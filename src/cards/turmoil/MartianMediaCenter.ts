import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';
import { PartyName } from '../../turmoil/parties/PartyName';
import { Resources } from "../../Resources";
import { HowToPay } from "../../inputs/HowToPay";
import { AndOptions } from "../../inputs/AndOptions";
import { SelectHowToPay } from "../../inputs/SelectHowToPay";
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

    public action(player: Player, game: Game) {
        let howToPay: HowToPay;
        return new AndOptions(
            () => {
              if (howToPay.megaCredits + howToPay.heat < 3) {
                throw new Error('Need to pay 3');
              }
              player.heat -= howToPay.heat;
              player.megaCredits -= howToPay.megaCredits;
              game.addInterrupt(new SelectParty(player, game));
              return undefined;
            },
            new SelectHowToPay(
                'Select how to pay for action', true, false,
                player.canUseHeatAsMegaCredits, 3,
                (htp: HowToPay) => {
                  howToPay = htp;
                  return undefined;
                }
            )
        );
    }
}