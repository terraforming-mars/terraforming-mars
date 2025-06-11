import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {IPlayer} from '../../IPlayer';
import {Board} from '../../boards/Board';
import {Space} from '../../boards/Space';
import {IActionCard} from '../ICard';
import {vermin} from '../render/DynamicVictoryPoints';

export class Vermin extends ActionCard implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.VERMIN,
      tags: [Tag.MICROBE, Tag.ANIMAL],
      cost: 8,

      resourceType: CardResource.ANIMAL,
      victoryPoints: 'special',

      action: {
        or: {
          behaviors: [
            {
              title: 'Add one animal here',
              addResources: 1,
            },
            {
              title: 'Add 1 microbe to ANY card',
              addResourcesToAnyCard: {
                count: 1,
                type: CardResource.MICROBE,
                mustHaveCard: true,
              },
            },
          ],
          autoSelect: true,
        },
      },

      metadata: {
        cardNumber: 'X75',
        renderData: CardRenderer.builder((b) => {
          b.effect('When any city is placed, add 1 animal here.', (eb) => {
            eb.city({all}).startEffect.resource(CardResource.ANIMAL);
          });
          b.br;
          b.action('Add 1 animal here or 1 microbe to ANOTHER card.', (eb) => {
            eb.empty().startAction.resource(CardResource.ANIMAL).or().resource(CardResource.MICROBE).asterix();
          });
        }),
        victoryPoints: vermin(),
        description: 'Each player, including you, gets -1 VP per city they have IF THERE ARE AT LEAST 10 ANIMALS HERE.',
      },
    });
  }

  public override getVictoryPoints(player: IPlayer) {
    if (player.game.verminInEffect) {
      return -1 * player.game.board.getCities(player).length;
    }
    return 0;
  }

  public onTilePlaced(cardOwner: IPlayer, _activePlayer: IPlayer, space: Space) {
    if (Board.isCitySpace(space)) {
      cardOwner.addResourceTo(this, {qty: 1, log: true});
    }
  }
}
