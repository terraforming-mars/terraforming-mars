import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {ResourceType} from '../../common/ResourceType';
import {IResourceCard} from '../ICard';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardRenderer} from '../render/CardRenderer';

export class JovianLanterns extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cost: 20,
      tags: [Tags.JOVIAN],
      name: CardName.JOVIAN_LANTERNS,
      cardType: CardType.ACTIVE,

      resourceType: ResourceType.FLOATER,
      victoryPoints: VictoryPoints.resource(1, 2),
      tr: {tr: 1},
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
      },
    });
  }

  public override resourceCount: number = 0;

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
}
