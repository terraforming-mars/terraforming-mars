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
          b.tradeFleet().asterix;
        }),
      },
    });
  };

  public play(player: Player) {
    const game = player.game;
    game.getPlayers().forEach((player) => {
      player.tradesThisTurn = 1000;
    });
    game.log('All players may not retrieve their trade fleets for the rest of this generation.');
    return undefined;
  }
}
