import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {OrOptions} from '../../input/OrOptions';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {SelectOption} from '@/inputs/SelectOption';
import {SelectColony} from '@/inputs/SelectColony';

export class HuygensObservatory extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 27,
      tags: [Tags.SCIENCE, Tags.SPACE],
      name: CardName.HUYGENS_OBSERVATORY,
      cardType: CardType.AUTOMATED,
      victoryPoints: 1,
      tr: {tr: 1},

      metadata: {
        cardNumber: 'Pf61',
        renderData: CardRenderer.builder((b) => b.colonies(1)),
        description: 'Place a colony. MAY BE PLACED ON A COLONY TILE WHERE YOU ALREADY HAVE A COLONY. ' +
          'Trade for free. You may use a Trade Fleet that you used this generation already. Gain 1 TR.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    // Requirements:
    // 1. There must be a colony available to build on.
    // 2. Must be able to trade on the tile (eg available trade fleets cannot be on that tile.)
    return player.hasAvailableColonyTileToBuildOn(true);
  }

  public something(player: Player) {
    const game = player.game;
    if (player.tradesThisGeneration === 0) {
      return undefined;
    }
    const orOptions = new OrOptions();
    const visitedColonies = game.colonies.filter((colony) => colony.visitor === player.id);
    visitedColonies.forEach(element => {
      orOptions.options.push(new SelectOption())
    });
    if (visitedColonies.length > 0) {
      orOptions.options.push(new SelectColony('Select a colony to recall a trade fleet from', 'OK'))
    }
    const hasFreeTradeFleet = visitedColonies.length < player.getFleetSize();

  }

  public play(player: Player) {
    player.game.defer(new BuildColony(player, true, 'Select colony for Huygens Observatory'));
    player.increaseTerraformRating();
    return undefined;
  }
}
