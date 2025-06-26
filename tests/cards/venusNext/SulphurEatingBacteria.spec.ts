import {expect} from 'chai';
import {cast, setVenusScaleLevel} from '../../TestingUtils';
import {SulphurEatingBacteria} from '../../../src/server/cards/venusNext/SulphurEatingBacteria';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('SulphurEatingBacteria', () => {
  let card: SulphurEatingBacteria;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new SulphurEatingBacteria();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    setVenusScaleLevel(game, 4);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setVenusScaleLevel(game, 6);
    expect(card.canPlay(player)).is.true;
    cast(card.play(player), undefined);
  });

  it('Should act - both actions available', () => {
    player.playedCards.push(card);
    player.addResourceTo(card, 5);

    const action = cast(card.action(player), OrOptions);
    action.options[1].cb(3);
    expect(player.megaCredits).to.eq(9);
    expect(card.resourceCount).to.eq(2);
  });

  it('Should act - only one action available', () => {
    player.playedCards.push(card);
    expect(card.resourceCount).to.eq(0);

    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });
});
