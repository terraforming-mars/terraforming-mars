import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {IResourceCard} from '../ICard';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {CardRenderer} from '../render/CardRenderer';

export class JovianLanterns extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cost: 20,
      tags: [Tags.JOVIAN],
      name: CardName.JOVIAN_LANTERNS,
      cardType: CardType.ACTIVE,
      resourceType: ResourceType.FLOATER,

      requirements: CardRequirements.builder((b) => b.tag(Tags.JOVIAN)),
      metadata: {
        cardNumber: 'C18',
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
      },
    });
  }

  public resourceCount: number = 0;

  public canPlay(player: Player): boolean {
    if (!super.canPlay(player)) {
      return false;
    }

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST);
    }

    return true;
  }

  public canAct(player: Player): boolean {
    return player.titanium > 0;
  }

  public action(player: Player) {
    player.titanium--;
    player.addResourceTo(this, 2);
    return undefined;
  }

  public play(player: Player) {
    player.game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {count: 2}));
    player.increaseTerraformRating();
    return undefined;
  }

  public getVictoryPoints(): number {
    return Math.floor(this.resourceCount / 2);
  }
}
