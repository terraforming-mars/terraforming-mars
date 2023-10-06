import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {SelectSpace} from '../../inputs/SelectSpace';

export class KaguyaTech extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.KAGUYA_TECH,
      tags: [Tag.CITY, Tag.PLANT],
      cost: 10,

      behavior: {
        production: {megacredits: 2},
        drawCard: 1,
      },

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).cards(1).br;
          b.minus().greenery({withO2: false}).plus().city().asterix().br;
          b.plainText('Increase M€ production 2 steps. Draw 1 card. ' +
          'Remove 1 of your greenery tiles (does not affect oxygen.) ' +
          'Place a city tile there, regardless of placement rules. ' +
          'Gain placement bonuses as usual.');
        }),
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    // TODO(kberg): Yes But, if the only greenery is Wetlands, warn the player.
    return player.game.board.getGreeneries(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    const greeneries = player.game.board.getGreeneries(player);
    return new SelectSpace('Select a greenery to convert to a city.', greeneries)
      .andThen((space) => {
        player.game.removeTile(space.id);
        player.game.addCity(player, space, this.name);
        return undefined;
      });
  }
}
