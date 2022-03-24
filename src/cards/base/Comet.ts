import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Comet extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.COMET,
      tags: [Tags.SPACE],
      cost: 21,
      tr: {temperature: 1, oceans: 1},

      metadata: {
        cardNumber: '010',
        description: 'Raise temperature 1 step and place an ocean tile. Remove up to 3 Plants from any player.',
        renderData: CardRenderer.builder((b) => {
          b.temperature(1).oceans(1).br;
          b.minus().plants(-3, {all});
        }),
      },
    });
  }

  public play(player: Player) {
    player.game.increaseTemperature(player, 1);
    player.game.defer(new PlaceOceanTile(player));
    player.game.defer(new RemoveAnyPlants(player, 3));
    return undefined;
  }
}
