import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Player} from '../../Player';
import {Card} from '../Card';
import {Tags} from '../Tags';

export class SyndicatePirateRaids extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SYNDICATE_PIRATE_RAIDS,
      cardType: CardType.EVENT,
      tags: [Tags.SPACE],
      cost: 8,

      metadata: {
        description: 'ALL OPPONENTS CANNOT RETRIEVE THEIR TRADE FLEETS THIS GENERATION',
        cardNumber: 'M65',
        renderData: CardRenderer.builder((b) => {
          b.tradeFleet().asterix();
        }),
      },
    });
  };

  public play(player: Player) {
    const game = player.game;
    game.syndicatePirateRaider = player.id;

    game.log(
      'All players except ${0} may not retrieve their trade fleets this generation.',
      (b) => b.player(player));
    return undefined;
  }
}
