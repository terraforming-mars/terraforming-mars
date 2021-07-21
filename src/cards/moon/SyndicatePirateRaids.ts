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
        description: 'DURING THE NEXT SOLAR PHASE, ALL OPPONENTS\' TRADE FLEETS WILL REMAIN ON THE COLONY TILES THEY OCCUPY.',
        cardNumber: 'M65',
        renderData: CardRenderer.builder((b) => {
          b.tradeFleet()./* any.*/asterix(); // any and asterix both have filters, and one clobbers the other.
        }),
      },
    });
  };

  public play(player: Player) {
    const game = player.game;
    game.syndicatePirateRaider = player.id;

    game.log(
      'All players except ${0} will keep their trade fleets on the colony tiles they occupy this solar phase.',
      (b) => b.player(player));
    return undefined;
  }
}
