import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { ResourceType } from '../../ResourceType';
import { SelectCard } from '../../inputs/SelectCard';
import { Game } from '../../Game';
import { ICard } from '../ICard';
import { CardName } from '../../CardName';
import { LogHelper } from "../../components/LogHelper";
import { MAX_VENUS_SCALE, REDS_RULING_POLICY_COST } from "../../constants";
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";

export class VenusianPlants implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.VENUS, Tags.PLANT];
    public name: CardName = CardName.VENUSIAN_PLANTS;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game) {
        const meetsVenusRequirements = game.getVenusScaleLevel() >= 16 - (2 * player.getRequirementsBonus(game, true));
        const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;

        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !venusMaxed) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST) && meetsVenusRequirements;
        }
  
        return meetsVenusRequirements;
    }
    
    public play(player: Player, game: Game) {
        game.increaseVenusScaleLevel(player,1);
        const cards = this.getResCards(player);
        if (cards.length === 0) return undefined;

        if (cards.length === 1) {
            player.addResourceTo(cards[0], 1);
            LogHelper.logAddResource(game, player, cards[0]);
            return undefined;
        }

        return new SelectCard(
            'Select card to add 1 resource',
            cards,
            (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], 1);
              LogHelper.logAddResource(game, player, foundCards[0]);
              return undefined;
            }
        );
    }
    public getVictoryPoints() {
        return 1;
    }
    public getResCards(player: Player): ICard[] {
        let resourceCards = player.getResourceCards(ResourceType.MICROBE);
        resourceCards = resourceCards.concat(player.getResourceCards(ResourceType.ANIMAL));
        return resourceCards.filter(card => card.tags.indexOf(Tags.VENUS) !== -1);
    }
}