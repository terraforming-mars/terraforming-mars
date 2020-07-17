import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { Resources } from "../../Resources";
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";
import { REDS_RULING_POLICY_COST, MAX_TEMPERATURE } from "../../constants";

export class SmallAsteroid implements IProjectCard {
    public cost: number = 10;
    public name: CardName = CardName.SMALL_ASTEROID;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game) {
        const canRaiseTemperature = game.getTemperature() < MAX_TEMPERATURE;
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && canRaiseTemperature) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST, game, false, true);
        }
  
        return true;
    }

    public play(player: Player, game: Game) {
        game.increaseTemperature(player, 1);
        game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 2);
        return undefined;
    }

}