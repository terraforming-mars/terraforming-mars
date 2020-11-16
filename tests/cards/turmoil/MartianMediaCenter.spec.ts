import {expect} from 'chai';
import {MartianMediaCenter} from '../../../src/cards/turmoil/MartianMediaCenter';
import {Player} from '../../../src/Player';
import {Color} from '../../../src/Color';
import {Game} from '../../../src/Game';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {Resources} from '../../../src/Resources';
import {setCustomGameOptions} from '../../TestingUtils';

describe('MartianMediaCenter', function() {
  it('Should play', function() {
    const card = new MartianMediaCenter();
    const player = new Player('test', Color.BLUE, false);

    const gameOptions = setCustomGameOptions();
    const game = new Game('foobar', [player], player, gameOptions);
    expect(card.canPlay(player, game)).is.not.true;

    const mars = game.turmoil!.getPartyByName(PartyName.MARS)!;
    mars.delegates.push(player.id, player.id);
    expect(card.canPlay(player, game)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });
});
