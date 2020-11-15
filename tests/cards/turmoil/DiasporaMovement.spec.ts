import {expect} from 'chai';
import {DiasporaMovement} from '../../../src/cards/turmoil/DiasporaMovement';
import {Player} from '../../../src/Player';
import {Color} from '../../../src/Color';
import {Resources} from '../../../src/Resources';
import {Game} from '../../../src/Game';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {ColonizerTrainingCamp} from '../../../src/cards/ColonizerTrainingCamp';
import {MethaneFromTitan} from '../../../src/cards/MethaneFromTitan';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {IParty} from '../../../src/turmoil/parties/IParty';
import {setCustomGameOptions} from '../../TestingUtils';

describe('DiasporaMovement', function() {
  let card : DiasporaMovement; let player : Player; let player2 : Player; let game : Game; let turmoil: Turmoil; let reds: IParty;

  beforeEach(function() {
    card = new DiasporaMovement();
    player = new Player('test', Color.BLUE, false);
    player2 = new Player('test2', Color.RED, false);

    const gameOptions = setCustomGameOptions();
    game = new Game('foobar', [player, player2], player, gameOptions);
    turmoil = game.turmoil!;
    reds = turmoil.getPartyByName(PartyName.REDS)!;
  });

  it('Can\'t play', function() {
    reds.sendDelegate(player.id, game);
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    reds.sendDelegate(player.id, game);
    reds.sendDelegate(player.id, game);
    expect(card.canPlay(player, game)).is.true;

    player.playedCards.push(new ColonizerTrainingCamp());
    player2.playedCards.push(new MethaneFromTitan());
    card.play(player, game);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(3);
  });
});
