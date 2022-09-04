import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Player} from '../../Player';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class SyndicatePirateRaids extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SYNDICATE_PIRATE_RAIDS,
      cardType: CardType.EVENT,
      tags: [Tag.SPACE],
      cost: 8,

      metadata: {
        description: 'ALL OPPONENTS CANNOT RETRIEVE THEIR TRADE FLEETS THIS GENERATION',
        cardNumber: 'M65',
        renderData: CardRenderer.builder((b) => {
          b.tradeFleet().asterix();
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    const game = player.game;
    game.syndicatePirateRaider = player.id;

    game.log(
      'All players except ${0} may not retrieve their trade fleets this generation.',
      (b) => b.player(player));
    return undefined;
  }
}
