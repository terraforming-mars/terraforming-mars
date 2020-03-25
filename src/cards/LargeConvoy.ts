import {ICard} from './ICard';

import { Player } from "../Player";
import { Game } from "../Game";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { OrOptions } from "../inputs/OrOptions";
import { SelectCard } from "../inputs/SelectCard";
import { SelectOption } from "../inputs/SelectOption";
import { PlayerInput } from "../PlayerInput";
import { ResourceType } from '../ResourceType';
import { CardName } from '../CardName';

export class LargeConvoy implements IProjectCard {
    public cost: number = 36;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: CardName = CardName.LARGE_CONVOY;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, game: Game): PlayerInput | undefined {
        player.cardsInHand.push(game.dealer.dealCard(), game.dealer.dealCard());

        const cards = player.getResourceCards(ResourceType.ANIMAL);

        if (cards.length === 0 ) {
            player.plants += 5;
            game.addOceanInterrupt(player);
            return undefined;
        }

        return new OrOptions(
            new SelectOption(
                "Gain 5 plants", 
                () => { 
                    player.plants += 5; 
                    game.addOceanInterrupt(player);
                    return undefined; 
                }
            ),
            new SelectCard(
                "Select card to add 4 animals", 
                cards, 
                (foundCards: Array<ICard>) => { 
                    player.addResourceTo(foundCards[0], 4);
                    game.addOceanInterrupt(player);
                    return undefined;
                }
            )
        );
    }
    public getVictoryPoints() {
        return 2;
    }
}
