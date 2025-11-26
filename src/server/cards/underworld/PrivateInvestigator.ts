import {CardType} from '@/common/cards/CardType';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Card} from '@/server/cards/Card';
import {any} from '@/server/cards/render/DynamicVictoryPoints';
import {IPlayer} from '@/server/IPlayer';
import {SelectPlayer} from '@/server/inputs/SelectPlayer';
import {Size} from '@/common/cards/render/Size';

export class PrivateInvestigator extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.PRIVATE_INVESTIGATOR,
      type: CardType.EVENT,
      cost: 4,
      victoryPoints: 'special',

      behavior: {
        tr: 1,
      },

      metadata: {
        cardNumber: 'U038',
        renderData: CardRenderer.builder((b) => {
          b.text('TARGET A PLAYER WITH MORE CORRUPTION THAN YOU.', Size.SMALL, true).br;
          b.text('PLACE THIS CARD FACE DOWN IN THAT PLAYER\'S PROJECT CARD PILE.', Size.SMALL, true).br;
          b.tr(1);
        }),
        description: 'Gain 1 TR.',
        victoryPoints: any(-1),
      },
    });
  }

  private targets(player: IPlayer) {
    return player.game.players.filter((p) => p.underworldData.corruption > player.underworldData.corruption);
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
