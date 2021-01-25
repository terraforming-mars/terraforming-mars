import {expect} from 'chai';
import {DawnCity} from '../../../src/cards/venusNext/DawnCity';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('DawnCity', function() {
  it('Should play', function() {
    const card = new DawnCity();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
    player.addProduction(Resources.ENERGY);
    expect(card.canPlay(player)).is.not.true;

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
  });
});
