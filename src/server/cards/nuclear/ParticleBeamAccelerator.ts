import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
//import {Phase} from '../../../common/Phase';
import {played} from '../Options';
import {IActionCard} from '../ICard';
import {SelectOption} from '../../inputs/SelectOption';
import {LogHelper} from '../../LogHelper';
import {PlayerInput} from '../../PlayerInput';
import {OrOptions} from '../../inputs/OrOptions';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '../Options';

export class ParticleBeamAccelerator extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PARTICLE_BEAM_ACCELERATOR,
      tags: [Tag.SCIENCE, Tag.POWER],
      cost: 18,
      resourceType: CardResource.RADIATION,

      victoryPoints: {resourcesHere: {}, per: 4},
      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 2)),

     /* action: {
        or: {
          autoSelect: false,
          behaviors: [{
            title: 'Remove 1 radiation to gain 1 titanium',
            spend: {resourcesHere: 1},
            stock: {titanium: 1},
          },
          {
            title: 'Remove 1 radiation to gain 1 energy',
            spend: {resourcesHere: 1},
            stock: {energy: 1},
          },
          {
            title: 'Remove 1 radiation to gain 2 heat',
            spend: {resourcesHere: 1},
            stock: {heat: 1},
          }],
        },
      },*/

      metadata: {
        cardNumber: 'N18',
        description: {
          text: 'Requires 2 science tags.',
          align: 'left'},
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a science tag or power tag, including this, add 1 radiation to this card.', (be) => {
            be.science(1, {played}).slash();
            be.energy(1, {played});
            be.startEffect.radiations(1);
          }).br;
          b.action('Spend 1 radiation here to increase gain 1 titanium or 1 energy or 2 heat.', (eb) => {
            eb.radiations(1)
              .startAction.titanium(1).slash(Size.SMALL).energy(1).slash(Size.SMALL).heat(2, {digit});
          }).br;
          b.vpText('1 VP per 4 radiations on this card.');
        }),
      },
    });
  }
  public onCardPlayed(player: Player, card: IProjectCard): void {
    const qty = player.tags.cardTagCount(card, [Tag.SCIENCE, Tag.POWER]);
    player.addResourceTo(this, {qty, log: true});

  }

  public canAct(player: Player): boolean {
    return player.canAfford(0) || this.resourceCount > 0;
  }

  public action(player: Player) {
    //const hasRadiation = this.resourceCount > 0;

    const gainTitaniumOption = new SelectOption('Remove 1 radiation on this card to gain 1 titanium', 'Remove radiation', () => {
      this.resourceCount--;
      player.titanium += 1;
      LogHelper.logRemoveResource(player, this, 1, 'gain 1 titanium');
      return undefined;
    });

    const gainEnergyOption = new SelectOption('Remove 1 radiation on this card to gain 1 energy', 'Remove radiation', () => {
      this.resourceCount--;
      player.energy += 1;
      LogHelper.logRemoveResource(player, this, 1, 'gain 1 energy');
      return undefined;
    });

    const gainHeatOption = new SelectOption('Remove 1 radiation on this card to gain 2 heats', 'Remove radiation', () => {
      this.resourceCount--;
      player.heat += 2;
      LogHelper.logRemoveResource(player, this, 1, 'gain 2 heat');
      return undefined;
    });

    const opts: Array<PlayerInput> = [];
    opts.push(gainTitaniumOption);
    opts.push(gainEnergyOption);
    opts.push(gainHeatOption);

    return new OrOptions(...opts);
  }
}

