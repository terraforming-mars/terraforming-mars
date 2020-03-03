import {ICard} from './ICard';

import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { SelectCard } from "../inputs/SelectCard";
import { PlayerInput } from "../PlayerInput";
import { ResourceType } from '../ResourceType';
import { CardName } from '../CardName';

export class ImportedHydrogen implements IProjectCard {
    public cost: number = 16;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: string = CardName.IMPORTED_HYDROGEN;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, game: Game): undefined | PlayerInput {

        return new OrOptions(
            new SelectOption("Gain 3 plants", () => {
                player.plants += 3;
                game.addOceanInterrupt(player);
                return undefined;
            }),
            new SelectCard("Add 3 microbes to card", player.getResourceCards(ResourceType.MICROBE), (foundCards: Array<ICard>) => {
                player.addResourceTo(foundCards[0], 3);
                game.addOceanInterrupt(player);
                return undefined;
            }),
            new SelectCard("Add 2 animals to card", player.getResourceCards(ResourceType.ANIMAL), (foundCards: Array<ICard>) => {
                player.addResourceTo(foundCards[0], 2);
                game.addOceanInterrupt(player);
                return undefined;
            })
        )
    }
}
