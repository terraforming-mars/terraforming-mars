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
import { LogMessageType } from "../../LogMessageType";
import { LogMessageData } from "../../LogMessageData";
import { LogMessageDataType } from "../../LogMessageDataType";

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
                this.logResourceGain(player, game, "titanium");
                return undefined;
            }),
            new SelectOption("Gain 1 steel", () => {
                player.steel += 1;
                this.logResourceGain(player, game, "steel");
                return undefined;
            }),
            new SelectOption("Gain 1 plant", () => {
                player.plants += 1;
                this.logResourceGain(player, game, "plant");
                return undefined;
            }),
            new SelectOption("Gain 1 energy", () => {
                player.energy += 1;
                this.logResourceGain(player, game, "energy");
                return undefined;
            }),
            new SelectOption("Gain 1 heat", () => {
                player.heat += 1;
                this.logResourceGain(player, game, "heat");
                return undefined;
            }),
            new SelectOption("Gain 1 MC", () => {
                player.megaCredits += 1;
                this.logResourceGain(player, game, "MC");
                return undefined;
            })
        );

        const addResourceToSelf = new SelectOption("Add 1 asteroid to this card and gain a standard resource", () => {
            this.resourceCount++;
            game.log(
                LogMessageType.DEFAULT,
                "${0} added 1 asteroid to ${1}",
                new LogMessageData(LogMessageDataType.PLAYER, player.id),
                new LogMessageData(LogMessageDataType.CARD, this.name)
            );

            return gainStandardResource;
        });

        const addResource = new SelectCard(
            'Select card to add 1 asteroid and gain a standard resource',
            asteroidCards,
            (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], 1);
              game.log(
                LogMessageType.DEFAULT,
                "${0} added 1 asteroid to ${1}",
                new LogMessageData(LogMessageDataType.PLAYER, player.id),
                new LogMessageData(LogMessageDataType.CARD, foundCards[0].name)
            );

              return gainStandardResource;
            }
        );

        const spendResource = new SelectOption("Remove 1 asteroid on this card to gain 3 titanium", () => {
            this.resourceCount--;
            player.titanium += 3;
            game.log(
                LogMessageType.DEFAULT,
                "${0} spent an asteroid to gain 3 titanium",
                new LogMessageData(LogMessageDataType.PLAYER, player.id)
            );

            return undefined;
        });

        if (this.resourceCount > 0) opts.push(spendResource);
        asteroidCards.length === 1 ? opts.push(addResourceToSelf) : opts.push(addResource);

        return new OrOptions(...opts);
    }

    public play() {
        this.resourceCount = 3;
        return undefined;
    }

    private logResourceGain(player: Player, game: Game, resource: string) {
        game.log(
            LogMessageType.DEFAULT,
            "${0} gained 1 ${1}",
            new LogMessageData(LogMessageDataType.PLAYER, player.id),
            new LogMessageData(LogMessageDataType.STRING, resource)
        );
    }
}
