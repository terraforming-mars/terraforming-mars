import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {Game} from '../../Game';
import {IResourceCard} from '../ICard';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

export class JovianLanterns implements IProjectCard, IResourceCard {
    public cost = 20;
    public tags = [Tags.JOVIAN];
    public name = CardName.JOVIAN_LANTERNS;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.FLOATER;
    public resourceCount: number = 0;

    public canPlay(player: Player, game: Game): boolean {
      const meetsTagRequirements = player.getTagCount(Tags.JOVIAN) >= 1;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST) && meetsTagRequirements;
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
      game.defer(new AddResourcesToCard(player, game, ResourceType.FLOATER, 2));
      player.increaseTerraformRating(game);
      return undefined;
    }

    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 2);
    }
}
