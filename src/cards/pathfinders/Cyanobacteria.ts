import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../../common/cards/Tags';
import {ResourceType} from '../../common/ResourceType';
import {AddResourcesToCards} from '../../deferredActions/AddResourcesToCards';

export class Cyanobacteria extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CYANOBACTERIA,
      cost: 12,
      tags: [Tags.MICROBE, Tags.MARS],
      tr: {oxygen: 1},

      metadata: {
        cardNumber: 'Pf27',
        renderData: CardRenderer.builder((b) => {
          b.oxygen(1).br;
          b.microbes(1).asterix().slash().oceans(1).br;
        }),
        description: 'Raise the oxygen level 1%. For every ocean tile, place a microbe on any card.',
      },
    });
  }

  public play(player: Player) {
    player.game.increaseOxygenLevel(player, 1);
    const microbes = player.game.board.getOceanSpaces({upgradedOceans: true, wetlands: true}).length;
    player.game.defer(new AddResourcesToCards(player, ResourceType.MICROBE, microbes));
    return undefined;
  }
}

