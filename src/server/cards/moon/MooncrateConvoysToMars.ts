import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Player} from '../../Player';
import {SellSteel} from '../../moon/SellSteel';
import {all} from '../Options';
import {IProjectCard} from '../IProjectCard';

export class MooncrateConvoysToMars extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MOONCRATE_CONVOYS_TO_MARS,
      cardType: CardType.EVENT,
      cost: 13,
      requirements: CardRequirements.builder((b) => b.party(PartyName.MARS)),

      behavior: {
        moon: {logisticsRate: 1},
      },

      metadata: {
        description: 'Requires that Mars First are ruling or that you have 2 delegates there. ' +
          'Raise the Logistic Rate 1 step. All players may sell their steel resources for 3M€ each.',
        cardNumber: 'M60',
        renderData: CardRenderer.builder((b) => {
          b.moonLogisticsRate().br;
          b.text('X').steel(1, {all}).colon().text('X').megacredits(3);
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    const game = player.game;
    game.getPlayers().forEach((player) => {
      game.defer(new SellSteel(player));
    });
    return undefined;
  }
}
