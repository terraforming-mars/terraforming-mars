import {ICard} from './ICard';
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { AndOptions } from "../inputs/AndOptions";
import { SelectCard } from "../inputs/SelectCard";
import { ResourceType } from '../ResourceType';
import { CardName } from '../CardName';
import { Game } from '../Game';
import { LogHelper } from '../components/LogHelper';
import { PartyHooks } from '../turmoil/parties/PartyHooks';
import { PartyName } from '../turmoil/parties/PartyName';
import { REDS_RULING_POLICY_COST } from '../constants';

export class ImportedNitrogen implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: CardName = CardName.IMPORTED_NITROGEN;
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game) {
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST, game, false, true);
        }
  
        return true;
    }

    private giveResources(player: Player, game: Game): undefined {
        player.increaseTerraformRating(game);
        player.plants += 4;
        return undefined;
    }
    public play(player: Player, game: Game) {
        const otherAnimalCards = player.getResourceCards(ResourceType.ANIMAL);
        const otherMicrobeCards = player.getResourceCards(ResourceType.MICROBE);

        if (otherAnimalCards.length === 0 && otherMicrobeCards.length === 0) {
            return this.giveResources(player, game);
        } else if (otherAnimalCards.length > 0 && otherMicrobeCards.length > 0) {
            return new AndOptions(
                () => this.giveResources(player, game),
                new SelectCard("Select card to add 3 microbes", otherMicrobeCards, (foundCards: Array<ICard>) => {
                    player.addResourceTo(foundCards[0], 3);
                    LogHelper.logAddResource(game, player, foundCards[0], 3);
                    return undefined;
                }),
                new SelectCard("Select card to add 2 animals", otherAnimalCards, (foundCards: Array<ICard>) => {
                    player.addResourceTo(foundCards[0], 2);
                    LogHelper.logAddResource(game, player, foundCards[0], 2);
                    return undefined;
                })
            );
        } else if (otherAnimalCards.length > 0) {
            return new SelectCard("Select card to add 2 animals", otherAnimalCards, (foundCards: Array<ICard>) => {
                player.addResourceTo(foundCards[0], 2);
                LogHelper.logAddResource(game, player, foundCards[0], 2);
                return this.giveResources(player, game);
            });
        }
        return new SelectCard("Select card to add 3 microbes", otherMicrobeCards, (foundCards: Array<ICard>) => {
            player.addResourceTo(foundCards[0], 3);
            LogHelper.logAddResource(game, player, foundCards[0], 3);
            return this.giveResources(player, game);
        });
    }
}
