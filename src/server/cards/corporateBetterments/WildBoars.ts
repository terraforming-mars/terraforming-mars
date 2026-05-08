import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resource} from '../../../common/Resource';

export class WildBoars extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.WILD_BOARS,
      tags: [Tag.ANIMAL],
      cost: 12,

      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: {}},
      requirements: {oxygen: 11},

      metadata: {
        cardNumber: 'B26',
        description: 'Requires at least 11% Oxygen. 1 VP for each Animal on this card.',
        renderData: CardRenderer.builder((b) => {
          b.action('Remove 1 Plant from any opponent to add 1 Animal to this card.', (ab) => {
            ab.plants(-1).startAction.resource(CardResource.ANIMAL);
          }).br;
          b.vpText('1 VP for each Animal on this card.');
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    if (player.game.isSoloMode()) return true;
    return player.game.players.some((p) => p !== player && p.plants > 0);
  }

  public action(player: IPlayer) {
    const game = player.game;
    const opponents = game.players.filter((p) => p !== player && p.plants > 0);

    if (game.isSoloMode() || opponents.length === 0) {
      player.addResourceTo(this, {qty: 1, log: true});
      return undefined;
    }

    const options = opponents.map((opponent) =>
      new SelectOption(`Remove 1 plant from ${opponent.name}`, 'Remove plant').andThen(() => {
        opponent.attack(player, Resource.PLANTS, 1, {log: true});
        player.addResourceTo(this, {qty: 1, log: true});
        return undefined;
      }),
    );

    return new OrOptions(...options).setTitle('Select an opponent to remove 1 plant from');
  }
}
