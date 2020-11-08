import { Game } from "../../Game";
import { ICard } from "../ICard";
import { Player } from "../../Player";
import { PlayerInput } from "../../PlayerInput";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectCard } from "../../inputs/SelectCard";
import { IProjectCard } from "../IProjectCard";
import { ResourceType } from "../../ResourceType";
import { SelectOption } from "../../inputs/SelectOption";
import { SelectSpace } from "../../inputs/SelectSpace";
import { CardType } from "../CardType";

export interface CorporationCard extends ICard {
    initialActionText?: string;
    initialAction?: (player: Player, game: Game) => PlayerInput | undefined;
    startingMegaCredits: number;
    play: (
        player: Player,
        game: Game
    ) => SelectCard<ICard> | OrOptions | undefined;
    action?: (
        player: Player,
        game: Game
    ) => OrOptions | SelectCard<ICard> | SelectOption | SelectSpace | undefined;
    onCardPlayed?: (
        player: Player,
        game: Game,
        card: IProjectCard
    ) => OrOptions | void;
    onCorpCardPlayed?: (
        player: Player,
        game: Game,
        card: CorporationCard
    ) => OrOptions | void;
    resourceType?: ResourceType;
    onProductionPhase?: (player: Player) => undefined;
    isDisabled?: boolean;
    cardType: CardType;
}
