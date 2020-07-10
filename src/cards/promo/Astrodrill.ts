import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from '../corporation/CorporationCard';
import { IActionCard, ICard } from '../ICard';
import { CardName } from '../../CardName';
import { ResourceType } from "../../ResourceType";
import { SelectOption } from "../../inputs/SelectOption";
import { SelectCard } from "../../inputs/SelectCard";
import { OrOptions } from "../../inputs/OrOptions";
import { Game } from "../../Game";
import { LogHelper } from "../../components/LogHelper";
import { Resources } from "../../Resources";

export class Astrodrill implements IActionCard, CorporationCard {
    public name: CardName = CardName.ASTRODRILL;
    public tags: Array<Tags> = [Tags.SPACE];
    public startingMegaCredits: number = 38;
    public resourceType: ResourceType = ResourceType.ASTEROID;
    public resourceCount: number = 0;

    public canAct(): boolean {
        return true;
    }

    public action(player: Player, game: Game) {
        const asteroidCards = player.getResourceCards(ResourceType.ASTEROID);
        var opts: Array<SelectOption | SelectCard<ICard>> = [];

        const gainStandardResource = new OrOptions(
            new SelectOption("Gain 1 titanium", () => {
                player.titanium += 1;
                LogHelper.logGainStandardResource(game, player, Resources.TITANIUM);
                return undefined;
            }),
            new SelectOption("Gain 1 steel", () => {
                player.steel += 1;
                LogHelper.logGainStandardResource(game, player, Resources.STEEL);
                return undefined;
            }),
            new SelectOption("Gain 1 plant", () => {
                player.plants += 1;
                LogHelper.logGainStandardResource(game, player, Resources.PLANTS);
                return undefined;
            }),
            new SelectOption("Gain 1 energy", () => {
                player.energy += 1;
                LogHelper.logGainStandardResource(game, player, Resources.ENERGY);
                return undefined;
            }),
            new SelectOption("Gain 1 heat", () => {
                player.heat += 1;
                LogHelper.logGainStandardResource(game, player, Resources.HEAT);
                return undefined;
            }),
            new SelectOption("Gain 1 MC", () => {
                player.megaCredits += 1;
                LogHelper.logGainStandardResource(game, player, Resources.MEGACREDITS);
                return undefined;
            })
        );

        const addResourceToSelf = new SelectOption("Add 1 asteroid to this card and gain a standard resource", () => {
            player.addResourceTo(this);
            LogHelper.logAddResource(game, player, this);

            return gainStandardResource;
        });

        const addResource = new SelectCard(
            'Select card to add 1 asteroid and gain a standard resource',
            asteroidCards,
            (foundCards: Array<ICard>) => {
                player.addResourceTo(foundCards[0], 1);
                LogHelper.logAddResource(game, player, foundCards[0]);

                return gainStandardResource;
            }
        );

        const spendResource = new SelectOption("Remove 1 asteroid on this card to gain 3 titanium", () => {
            this.resourceCount--;
            player.titanium += 3;
            LogHelper.logRemoveResource(game, player, this, 1, "gain 3 titanium");

            return undefined;
        });

        if (this.resourceCount > 0) opts.push(spendResource);
        asteroidCards.length === 1 ? opts.push(addResourceToSelf) : opts.push(addResource);

        if (opts.length === 1) {
            if (opts[0] instanceof SelectOption) return (opts[0] as SelectOption).cb() as OrOptions;
            return opts[0] as SelectCard<ICard>;
        }

        return new OrOptions(...opts);
    }

    public play() {
        this.resourceCount = 3;
        return undefined;
    }
}
