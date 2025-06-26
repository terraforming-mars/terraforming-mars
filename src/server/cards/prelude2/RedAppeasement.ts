import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {PartyName} from '../../../common/turmoil/PartyName';

export class RedAppeasement extends Card {
  constructor() {
    super({
      name: CardName.RED_APPEASEMENT,
      type: CardType.EVENT,
      cost: 0,
      requirements: {party: PartyName.REDS},

      behavior: {
        production: {megacredits: 2},
      },

      metadata: {
        cardNumber: 'P80',
        renderData: CardRenderer.builder((b) => {
          b.plainText('Requires that Reds are ruling or that you have 2 delegates there, ' +
          'AND THAT NO OTHER PLAYER HAS PASSED.').br;
          b.production((pb) => pb.megacredits(2)).text('PASS').asterix().br;
          b.plainText('Increase M€ production 2 steps. This counts as passing. You get no other turns this generation.');
        }),
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return player.game.getPassedPlayers().length === 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.pass();
    return undefined;
  }
}
