import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class PoseidonMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.POSEIDON,
      description: 'Setup: place 1 colony. Each colony you or MarsBot build (setup included) advances MarsBot\'s least-advanced track.',
      requiredExpansions: ['colonies'],
    });
  }

  public override setup(marsBot: IMarsBot): void {
    if (marsBot.maybePlaceRandomColony()) {
      marsBot.game.log('MarsBot (${0}): placed 1 colony', (b) => b.cardName(this.name));
    } else {
      marsBot.game.log('MarsBot (${0}): no eligible colony tile for setup', (b) => b.cardName(this.name));
    }
  }

  public override onColonyPlaced(marsBot: IMarsBot): void {
    marsBot.advanceTrack(marsBot.marsBotBoard.getLeastAdvancedTrackIndex());
    marsBot.game.log('MarsBot (${0}): colony placed, advance least-advanced track', (b) => b.cardName(this.name));
  }
}
