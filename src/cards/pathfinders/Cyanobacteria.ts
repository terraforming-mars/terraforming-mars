import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
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
        // TODO(kberg): include Wetlands
        description: 'Raise the oxygen level 1%. For every ocean tile, place a microbe on any card.',
      },
    });
  }

  public play(player: Player) {
    player.game.increaseOxygenLevel(player, 1);
    const microbes = player.game.board.getOceansOnBoard();
    player.game.defer(new AddResourcesToCards(player, ResourceType.MICROBE, microbes));
    return undefined;
  }
}

