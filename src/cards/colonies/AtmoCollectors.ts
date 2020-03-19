import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { ResourceType } from '../../ResourceType';
import { Game } from '../../Game';
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";

export class AtmoCollectors implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.ATMO_COLLECTORS;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;

    public canAct(): boolean {
        return true;
    } 

    public action(player: Player) {
        if (player.getResourcesOnCard(this) < 1) {
            player.addResourceTo(this);
            return undefined;
        }
        return new OrOptions(
            new SelectOption("Add 1 floater to this card", () => {
                player.addResourceTo(this);
                return undefined;
            }),
            new SelectOption("Remove 1 floater to gain 2 titanium", () => {
                player.removeResourceFrom(this, 1);
                player.titanium += 2;
                return undefined;
            }),
            new SelectOption("Remove 1 floater to gain 3 energy", () => {
                player.removeResourceFrom(this, 1);
                player.energy += 3;
                return undefined;
            }),
            new SelectOption("Remove 1 floater to gain 4 heat", () => {
                player.removeResourceFrom(this, 1);
                player.heat += 4;
                return undefined;
            })
        );
    }

    public play(player: Player, game: Game) {
      game.addResourceInterrupt(player, ResourceType.FLOATER, 2, this);
      return undefined;
    }
}

