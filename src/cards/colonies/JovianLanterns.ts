import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { ResourceType } from '../../ResourceType';
import { Game } from '../../Game';
import { IResourceCard } from '../ICard';
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";
import { REDS_RULING_POLICY_COST } from "../../constants";

export class JovianLanterns implements IProjectCard, IResourceCard {
    public cost: number = 20;
    public tags: Array<Tags> = [Tags.JOVIAN];
    public name: CardName = CardName.JOVIAN_LANTERNS;
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public canPlay(player: Player, game: Game): boolean {
        const meetsTagRequirements = player.getTagCount(Tags.JOVIAN) >= 1;

        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
            return player.canAfford(this.cost + REDS_RULING_POLICY_COST) && meetsTagRequirements;
        }

        return meetsTagRequirements;
    }

    public canAct(player: Player): boolean {
        return player.titanium > 0;
    }

    public action(player: Player) {
        player.titanium--;
        this.resourceCount += 2;
        return undefined;
    }

    public play(player: Player, game: Game) {
      game.addResourceInterrupt(player, ResourceType.FLOATER, 2, this);
      player.increaseTerraformRating(game);
      return undefined;
    }

    public getVictoryPoints(): number {
        return Math.floor(this.resourceCount / 2);
    }
}