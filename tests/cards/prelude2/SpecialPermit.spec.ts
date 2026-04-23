import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {SpecialPermit} from '../../../src/server/cards/prelude2/SpecialPermit';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Message} from '../../../src/common/logs/Message';
import {IGame} from '../../../src/server/IGame';

describe('SpecialPermit', () => {
  let card: SpecialPermit;
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let player4: TestPlayer;

  beforeEach(() => {
    card = new SpecialPermit();
    [game, player, player2, player3, player4] = testGame(4);
  });

  it('canPlay: requires opponent has at least 4 plants', () => {
    player2.plants = 3;
    expect(card.bespokeCanPlay(player)).is.false;

    player2.plants = 4;
    expect(card.bespokeCanPlay(player)).is.true;
  });

  it('canPlay: false when opponent plants are protected', () => {
    player2.plants = 4;
    player2.plantsAreProtected = () => true;
    expect(card.bespokeCanPlay(player)).is.false;
  });

  it('Play', () => {
    player.plants = 0;
    player2.plants = 4;

    card.play(player);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);

    expect(orOptions.options).has.lengthOf(1);
    orOptions.options[0].cb();
    expect(player.plants).to.equal(4);
    expect(player2.plants).to.equal(0);
  });

  it('Play: solo mode', () => {
    const [game, player] = testGame(1);
    player.plants = 0;

    card.play(player);
    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
    expect(player.plants).to.equal(4);
  });

  it('Play: only players with 4+ plants are presented as targets', () => {
    player.plants = 1;
    player2.plants = 2;
    player3.plants = 4;
    player4.plants = 4;

    card.play(player);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);

    expect(orOptions.options).has.length(2);
    expect((orOptions.options[0].title as Message).data[2].value).eq(player3.color);
    expect((orOptions.options[1].title as Message).data[2].value).eq(player4.color);

    orOptions.options[0].cb();

    expect(player.plants).to.equal(5);
    expect(player2.plants).to.equal(2);
    expect(player3.plants).to.equal(0);
    expect(player4.plants).to.equal(4);
  });
});
