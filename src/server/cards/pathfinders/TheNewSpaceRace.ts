import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {IPlayer} from '@/server/IPlayer';
import {PreludeCard} from '@/server/cards/prelude/PreludeCard';
import {Tag} from '@/common/cards/Tag';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {ChooseRulingPartyDeferred} from '@/server/turmoil/ChooseRulingPartyDeferred';

export class TheNewSpaceRace extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.THE_NEW_SPACE_RACE,
      tags: [Tag.SCIENCE, Tag.EARTH],

      behavior: {
        stock: {megacredits: 12},
      },

      metadata: {
        cardNumber: 'PfP14',
        renderData: CardRenderer.builder((b) => {
          b.firstPlayer().rulingParty().megacredits(12).br;
        }),
        description: 'REVEALED BEFORE ANY OTHER PRELUDE. You become starting player for the game. Choose and set a ruling policy for the first generation. Gain 12 M€.',
      },
    });
  }
  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    game.overrideFirstPlayer(player);
    Turmoil.ifTurmoil((player.game), (turmoil) => {
      player.game.defer(new ChooseRulingPartyDeferred(player, turmoil));
    });

    return undefined;
  }
}
