import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { ResourceType } from '../../ResourceType';
import { SelectCard } from '../../inputs/SelectCard';
import { Game } from '../../Game';
import { ICard } from '../ICard';
import { CardName } from '../../CardName';
import { LogHelper } from "../../components/LogHelper";
import { MAX_VENUS_SCALE, REDS_RULING_POLICY_COST } from "../../constants";
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";

export class VenusSoils implements IProjectCard {
    public cost: number = 20;
    public tags: Array<Tags> = [Tags.VENUS, Tags.PLANT];
    public name: CardName = CardName.VENUS_SOILS;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game) {
        const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !venusMaxed) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST);
        }
  
        return true;
    }

    public play(player: Player, game: Game) {
        player.setProduction(Resources.PLANTS);
        game.increaseVenusScaleLevel(player,1);

        const microbeCards = player.getResourceCards(ResourceType.MICROBE);

        if (microbeCards.length === 0) return undefined;

        if (microbeCards.length === 1) {
            player.addResourceTo(microbeCards[0], 2);
            LogHelper.logAddResource(game, player, microbeCards[0], 2);
            return undefined;
        }

        return new SelectCard(
            'Select card to add 1 resource',
            microbeCards,
            (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], 2);
              LogHelper.logAddResource(game, player, foundCards[0], 2);
              return undefined;
            }
        );
    }
}