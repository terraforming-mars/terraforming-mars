import {expect} from 'chai';
import {Ecotec} from '../../../src/server/cards/prelude2/Ecotec';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Ants} from '../../../src/server/cards/base/Ants';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectOption} from '../../../src/server/inputs/SelectOption';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast} from '../../../src/common/utils/utils';
import {churn} from '../../TestingUtils';

describe('Ecotec', () => {
  let card: Ecotec;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Ecotec();
    [/* game */, player] = testGame(1);
  });

  it('offers the only microbe card directly', () => {
    const tardigrades = new Tardigrades();
    player.playedCards.push(tardigrades);

    card.onCardPlayed(player, tardigrades);
    const options = cast(churn(undefined, player), OrOptions);
    const addMicrobe = cast(options.options[0], SelectOption);
    addMicrobe.cb(undefined);

    expect(tardigrades.resourceCount).eq(1);
  });

  it('prompts when multiple microbe cards are available', () => {
    const tardigrades = new Tardigrades();
    const ants = new Ants();
    player.playedCards.push(tardigrades, ants);

    card.onCardPlayed(player, tardigrades);
    const options = cast(churn(undefined, player), OrOptions);
    const addMicrobe = cast(options.options[0], SelectCard);
    addMicrobe.cb([ants]);

    expect(tardigrades.resourceCount).eq(0);
    expect(ants.resourceCount).eq(1);
  });
});
