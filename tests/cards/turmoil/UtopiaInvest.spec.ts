import {expect} from 'chai';
import {UtopiaInvest} from '../../../src/server/cards/turmoil/UtopiaInvest';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {cast, setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('UtopiaInvest', function() {
  it('Should play', function() {
    const card = new UtopiaInvest();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player, setCustomGameOptions());
    const play = card.play(player);
    expect(play).is.undefined;
    expect(player.production.titanium).to.eq(1);
    expect(player.production.steel).to.eq(1);
    const action = cast(card.action(player), OrOptions);
    action.options[2].cb();
    expect(player.titanium).to.eq(4);
    expect(player.production.titanium).to.eq(0);
  });
});
