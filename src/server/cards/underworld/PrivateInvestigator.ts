import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {IPlayer} from '../../IPlayer';
import {SelectPlayer} from '../../inputs/SelectPlayer';

export class PrivateInvestigator extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.PRIVATE_INVESTIGATOR,
      type: CardType.EVENT,
      cost: 8,
      victoryPoints: 'special',

      behavior: {
        tr: 1,
      },

      metadata: {
        cardNumber: 'U38',
        renderData: CardRenderer.builder((b) => {
          b.text('TARGET A PLAYER THAT HAS MORE CORRUPTION THAN YOU.').br;
          b.text('PLACE THIS CARD FACE DOWN IN THAT PLAYER\'S PROJECT CARD PILE').br;
          b.tr(1);
        }),
        description: 'Gain 1 TR.',
        victoryPoints: CardRenderDynamicVictoryPoints.any(-1),
      },
    });
  }

  private targets(player: IPlayer) {
    return player.game.getPlayers().filter((p) => p.underworldData.corruption > player.underworldData.corruption);
  }

  public override bespokeCanPlay(player: IPlayer) {
    return this.targets(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectPlayer(this.targets(player), 'Select player to investigate', 'investigate')
      .andThen((investigatedPlayer) => {
        investigatedPlayer.playedCards.push(this);
        return undefined;
      });
  }

  public override getVictoryPoints() {
    return -1;
  }
}
