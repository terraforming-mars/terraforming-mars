
import { IActionCard, IResourceCard } from './ICard';
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { ResourceType } from "../ResourceType";
import { SelectOption } from "../inputs/SelectOption";
import { CardName } from '../CardName';
import { Expansion } from '../Expansion';

export class RegolithEaters implements IActionCard, IProjectCard, IResourceCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.MICROBES];
    public name: CardName = CardName.REGOLITH_EATERS;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;

    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public canAct(): boolean {
        return true;
    }
    public action(player: Player, game: Game) {
        if (this.resourceCount < 2) {
            this.resourceCount++;
            return undefined;
        }
        return new OrOptions(
            new SelectOption("Add 1 microbe to this card", () => {
                this.resourceCount++;
                return undefined;
            }),
            new SelectOption("Remove 2 microbes to raise oxygen level 1 step", () => {
                player.removeResourceFrom(this, 2);
                return game.increaseOxygenLevel(player, 1);
            })
        );
    }

    public expansion: Expansion = Expansion.BASE_GAME;
    public cardNumber: string = "033";
    public content: string = `
        <div class="red-arrow"></div>
        <div class="microbe resource"></div>
        <br/>
        OR
        <div class="microbe resource"></div>
        <div class="microbe resource"></div>
        <div class="red-arrow"></div>
        <div class="tile oxygen-tile"></div>
        <div class="description">
            (Action: Add 1 Microbe to this card, or remove 2 Microbes from this card to raise oxygen level 1 step.)
        </div>
    `;
}
