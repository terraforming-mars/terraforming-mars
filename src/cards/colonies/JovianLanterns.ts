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
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';


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
      game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {count: 2}));
      player.increaseTerraformRating(game);
      return undefined;
    }

    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 2);
    }

    public metadata: CardMetadata = {
      cardNumber: 'C18',
      requirements: CardRequirements.builder((b) => b.tag(Tags.JOVIAN)),
      renderData: CardRenderer.builder((b) => {
        b.action('Spend 1 titanium to add 2 floaters here.', (eb) => {
          eb.titanium(1).startAction.floaters(2);
        }).br;
        b.tr(1).floaters(2).asterix().br;
        b.vpText('1 VP per 2 floaters here.');
      }),
      description: {
        text: 'Requires 1 Jovian tag. Increase your TR 1 step. Add 2 floaters to ANY card.',
        align: 'left',
      },
      victoryPoints: CardRenderDynamicVictoryPoints.floaters(1, 2),
    };
}
