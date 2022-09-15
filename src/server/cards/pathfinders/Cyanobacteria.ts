import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCards} from '../../deferredActions/AddResourcesToCards';

export class Cyanobacteria extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CYANOBACTERIA,
      cost: 12,
      tags: [Tag.MICROBE, Tag.MARS],

      behavior: {
        global: {oxygen: 1},
      },

      metadata: {
        cardNumber: 'Pf27',
        renderData: CardRenderer.builder((b) => {
          b.oxygen(1).br;
          b.microbes(1).asterix().slash().oceans(1).br;
        }),
        description: 'Raise the oxygen level 1%. For every ocean tile, add a microbe to ANY card.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    const microbes = player.game.board.getOceanSpaces({upgradedOceans: true, wetlands: true}).length;
    player.game.defer(new AddResourcesToCards(player, CardResource.MICROBE, microbes));
    return undefined;
  }
}

