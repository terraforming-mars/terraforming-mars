import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {ALL_RESOURCES} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {CardResource} from '../../../common/CardResource';
import {CardRequirements} from '../requirements/CardRequirements';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Size} from '../../../common/cards/render/Size';
import {newMessage} from '../../../server/logs/MessageBuilder';
import {Behavior} from '@/server/behavior/Behavior';

export class CloneTroopers extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.CLONE_TROOPERS,
      tags: [Tag.SCIENCE],
      cost: 12,
      resourceType: CardResource.CLONE_TROOPER,
      requirements: CardRequirements.builder((b) => b.oceans(6)),
      victoryPoints: {resourcesHere: {}},

      metadata: {
        cardNumber: 'SW02',
        renderData: CardRenderer.builder((b) => {
          b.arrow(Size.SMALL).cloneTrooper().or().cloneTrooper().arrow(Size.SMALL).text('STEAL', Size.SMALL).wild(1, {all});
          b.br;
          b.text('(Action: Add one Clone Trooper to this card OR remove one Clone Trooper from this card to steal one standard resource from any player.)', Size.TINY, false, false);
        }),
        description: 'Requires 6 ocean tiles. 1 VP per Clone Trooper on this card.',
      },
    });
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    if (this.resourceCount > 0) {
      const options = new OrOptions();
      options.options.push(new SelectOption('Add a Clone Trooper to this card', 'Add', () => {
        player.addResourceTo(this, {log: true});
        return undefined;
      }));
      if (player.game.isSoloMode()) {
        ALL_RESOURCES.forEach((resource) => {
          options.options.push(new SelectOption(
            newMessage('Steal 1 ${0}', (b) => b.string(resource)),
            'steal', () => {
              player.addResource(resource, 1);
              player.removeResourceFrom(this, 1);
              return undefined;
            }));
        });
      } else {
        const allPlayers = player.game.getPlayers().filter((p) => p.id === player.id);
        ALL_RESOURCES.forEach((resource) => {
          allPlayers.forEach((p) => {
            if (p.getResource(resource) > 0) {
              // TODO(kberg): Included protected resources
              options.options.push(new SelectOption(
                newMessage('Steal 1 ${0} from ${1}', (b) => b.string(resource).player(p)),
                'steal', () => {
                  p.stealResource(resource, 1, player);
                  player.removeResourceFrom(this, 1);
                  return undefined;
                }));
            }
          });
        });
      }
      if (options.options.length > 1) {
        return options;
      }
    }

    // Fallback.
    player.addResourceTo(this, {log: true});
    return undefined;
  }
}
