import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class GiantIceAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.GIANT_ICE_ASTEROID,
      tags: [Tags.SPACE],
      cost: 36,
      tr: {temperature: 2, oceans: 2},

      metadata: {
        description: 'Raise temperature 2 steps and place 2 ocean tiles. Remove up to 6 plants from any player.',
        cardNumber: '080',
        renderData: CardRenderer.builder((b) => {
          b.temperature(2).br;
          b.oceans(2).br;
          b.minus().plants(-6, {all});
        }),
      },
    });
  }

  public play(player: Player) {
    player.game.increaseTemperature(player, 2);
    player.game.defer(new PlaceOceanTile(player, 'Select space for first ocean'));
    player.game.defer(new PlaceOceanTile(player, 'Select space for second ocean'));
    player.game.defer(new RemoveAnyPlants(player, 6));
    return undefined;
  }
}
