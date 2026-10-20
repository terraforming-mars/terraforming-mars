import {expect} from 'chai';
import {ValuableGases} from '../../../src/server/cards/community/ValuableGases';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {LocalShading} from '../../../src/server/cards/venusNext/LocalShading';
import {SelectProjectCardToPlay} from '../../../src/server/inputs/SelectProjectCardToPlay';
import {Payment} from '../../../src/common/inputs/Payment';
import {cast} from '../../../src/common/utils/utils';
import {formatMessage} from '../../TestingUtils';

describe('ValuableGases', () => {
  let card: ValuableGases;
  let player: TestPlayer;

  beforeEach(() => {
    card = new ValuableGases();
    [/* game */, player] = testGame(2);
  });

  it('Should play', () => {
    card.play(player);
    expect(player.megaCredits).to.eq(6);
  });

  it('logs the floaters added to the played card', () => {
    const localShading = new LocalShading();
    player.cardsInHand = [localShading];
    player.megaCredits = localShading.cost;

    const selectProjectCardToPlay = cast(card.play(player), SelectProjectCardToPlay);
    player.game.gameLog.length = 0;
    selectProjectCardToPlay.payAndPlay(localShading, {...Payment.EMPTY, megacredits: localShading.cost});

    expect(localShading.resourceCount).eq(4);
    expect(player.game.gameLog.map(formatMessage).filter((message) => message.includes(' added '))).deep.eq([
      'blue added 4 Floater(s) to Local Shading',
    ]);
  });
});
