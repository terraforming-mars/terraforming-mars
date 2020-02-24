import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { ResourceType } from '../../ResourceType';
import { Game } from '../../Game';
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";

export class JupiterFloatingStation implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.JOVIAN];
    public name: string = CardName.JUPITER_FLOATING_STATION;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType = ResourceType.FLOATER;

    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 3;
    }

    public canAct(): boolean {
        return true;
    }

    public action(player: Player, game: Game) {
        return new OrOptions(
            new SelectOption("Add 1 floater to a Jovian card", () => {
                game.addResourceInterrupt(player, ResourceType.FLOATER, 1, undefined, Tags.JOVIAN, );
                return undefined;
            }),
            new SelectOption("Get 1 MC per floater here (max 4) ", () => {
                player.megaCredits += Math.min(player.getResourcesOnCard(this), 4);
                return undefined;
            })
        );
    }

    public play() {
      return undefined;
    }

    public getVictoryPoints(): number {
        return 1;
    }
}