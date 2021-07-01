import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {PartyName} from '../../turmoil/parties/PartyName';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Player} from '../../Player';
import {SellSteel} from '../../moon/SellSteel';

export class MooncrateConvoysToMars extends Card {
  constructor() {
    super({
      name: CardName.MOONCRATE_CONVOYS_TO_MARS,
      cardType: CardType.EVENT,
      cost: 13,
      requirements: CardRequirements.builder((b) => b.party(PartyName.MARS)),

      metadata: {
        description: 'Requires that Mars First are ruling or that you have 2 delegates there. ' +
          'Raise the Logistic Rate 1 step. All players may sell their steel resources for 3M€ each.',
        cardNumber: 'M60',
        renderData: CardRenderer.builder((b) => {
          b.moonLogisticsRate().br;
          b.text('X').steel(1).any.colon().text('X').megacredits(3);
        }),
      },
    });
  };

  public play(player: Player) {
    MoonExpansion.raiseLogisticRate(player, 1);
    const game = player.game;
    game.getPlayers().forEach((player) => {
      game.defer(new SellSteel(player));
    });
    return undefined;
  }
}
