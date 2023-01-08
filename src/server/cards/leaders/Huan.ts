import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from './LeaderCard';

import {all} from '../Options';

export class Huan extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.HUAN,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L29',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('ACTIVATE THE BELOW ABILITY');
          b.br.br;
          b.tradeFleet({all}).tradeFleet().asterix();
          b.br.br;
        }),
        description: 'All opponents cannot trade next generation. Gain 1 permanent trade fleet.',
      },
    });
  }

  public isDisabled = false;

  public override play() {
    return undefined;
  }

  public canAct(): boolean {
    return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    player.colonies.increaseFleetSize();
    game.syndicatePirateRaider = player.id;

    game.log(
      'All players except ${0} may not trade next generation.',
      (b) => b.player(player),
    );

    this.isDisabled = true;
    return undefined;
  }
}
