import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

export class Biobatteries extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.BIOBATTERIES,
      type: CardType.AUTOMATED,
      cost: 7,
      tags: [Tag.POWER, Tag.MICROBE],

      behavior: {
        production: {
          energy: 1,
        },
      },

      metadata: {
        cardNumber: 'U096',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1));
          b.nbsp;
          b.energy(1).slash().tag(Tag.MICROBE);
          b.br;
          b.resource(CardResource.MICROBE).asterix().slash().tag(Tag.POWER);
          b.br.plainText('NOTE: For the moment, all wild tags are going to energy.');
        }),
        description: 'Increase your energy production 1 step. Gain 1 energy ' +
          'for every microbe tag you have (including this.) For every power ' +
          'tag you have (including this) put 1 microbe on another card.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const powerTags = player.tags.count(Tag.POWER, 'raw') + 1; // including this
    const microbeTags = player.tags.count(Tag.MICROBE, 'raw') + 1; // including this
    const wildTags = player.tags.count(Tag.WILD, 'raw');
    player.stock.add(Resource.ENERGY, microbeTags + wildTags, {log: true});
    player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {count: powerTags}));
    return undefined;
  }
}
