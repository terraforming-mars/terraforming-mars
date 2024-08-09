import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {PartyName} from '../../../common/turmoil/PartyName';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {Turmoil} from '../../turmoil/Turmoil';

export class ColonialEnvoys extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 4,
      name: CardName.COLONIAL_ENVOYS,
      type: CardType.EVENT,
      requirements: {party: PartyName.UNITY},

      metadata: {
        cardNumber: 'P70',
        description: 'Requires that Unity is ruling or that you have 2 delegates there. Place 1 delegate for each colony you have. YOU MAY PLACE THEM IN SEPERATE PARTIES.',
        renderData: CardRenderer.builder((b) => {
          b.delegates(1).asterix().slash().colonies(1).br;
        }),
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    const coloniesCount = player.getColoniesCount();
    const delegatesCount = Turmoil.getTurmoil(player.game).getAvailableDelegateCount(player);

    if (coloniesCount > delegatesCount) {
      return false;
    }

    if (coloniesCount === 0 && delegatesCount === 0) {
      return true;
    }
    return true;
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    const coloniesCount = player.getColoniesCount();
    const delegatesCount = Turmoil.getTurmoil(player.game).getAvailableDelegateCount(player);
    if (coloniesCount === 0 && delegatesCount === 0) {
      return undefined;
    }
    for (let i = 0; i < coloniesCount; i++) {
      game.defer(new SendDelegateToArea(player));
    }
    return undefined;
  }
}
