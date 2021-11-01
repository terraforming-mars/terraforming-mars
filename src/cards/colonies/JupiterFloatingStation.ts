import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {IResourceCard} from '../ICard';
import {Resources} from '../../Resources';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';

export class JupiterFloatingStation extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cost: 9,
      tags: [Tags.JOVIAN],
      name: CardName.JUPITER_FLOATING_STATION,
      cardType: CardType.ACTIVE,
      resourceType: ResourceType.FLOATER,
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 3)),
      victoryPoints: 1,

      metadata: {
        cardNumber: 'C19',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 floater to a JOVIAN CARD.', (eb) => {
            eb.empty().startAction.floaters(1, {secondaryTag: Tags.JOVIAN});
          }).br;
          b.or().br;
          b.action('Gain 1 M€ for every floater here [MAX 4].', (eb) => {
            eb.empty().startAction;
            eb.megacredits(1).slash().floaters(1).text('[max 4]', Size.SMALL);
          });
        }),
        description: {
          text: 'Requires 3 Science tags.',
          align: 'left',
        },
      },
    });
  }

  public resourceCount: number = 0;

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    return new OrOptions(
      new SelectOption('Add 1 floater to a Jovian card', 'Add floater', () => {
        player.game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {
          restrictedTag: Tags.JOVIAN, title: 'Add 1 floater to a Jovian card',
        }));
        return undefined;
      }),
      new SelectOption('Gain 1 M€ per floater here (max 4) ', 'Gain M€', () => {
        player.addResource(Resources.MEGACREDITS, Math.min(this.resourceCount, 4), {log: true});
        return undefined;
      }),
    );
  }

  public play() {
    return undefined;
  }
}
