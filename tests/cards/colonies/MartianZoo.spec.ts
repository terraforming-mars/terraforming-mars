import {expect} from 'chai';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {MartianZoo} from '../../../src/server/cards/colonies/MartianZoo';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '@/common/utils/utils';
import {formatMessage} from '../../TestingUtils';

describe('MartianZoo', () => {
  let card: MartianZoo;
  let player: TestPlayer;

  beforeEach(() => {
    card = new MartianZoo();
    [/* game */, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    const lands = player.game.board.getAvailableSpacesOnLand(player);
    player.game.addCity(player, lands[0]);
    player.game.addCity(player, lands[1]);
    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
  });

  it('Can not act', () => {
    player.playedCards.push(card);
    expect(card.canAct()).is.not.true;
  });

  it('Should act', () => {
    card.onCardPlayed(player, new LunaGovernor());
    expect(card.canAct()).is.true;

    card.action(player);
    expect(player.megaCredits).to.eq(2);
    expect(card.resourceCount).to.eq(2);
  });

  it('logs the added animals', () => {
    player.game.gameLog.length = 0;
    card.onCardPlayed(player, new LunaGovernor());

    expect(player.game.gameLog.map(formatMessage).filter((message) => message.includes(' added '))).deep.eq([
      'blue added 2 Animal(s) to Martian Zoo',
    ]);
  });
});
