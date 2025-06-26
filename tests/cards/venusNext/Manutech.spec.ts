import {expect} from 'chai';
import {PowerPlantStandardProject} from '../../../src/server/cards/base/standardProjects/PowerPlantStandardProject';
import {Manutech} from '../../../src/server/cards/venusNext/Manutech';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Manutech', () => {
  let card: Manutech;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Manutech();
    [game, player] = testGame(2);
    player.corporations.push(card);
  });

  it('Should play', () => {
    card.play(player);
    expect(player.production.steel).to.eq(1);
    expect(player.steel).to.eq(1);
  });

  it('Should add energy resources by Power Plant standard project', () => {
    player.megaCredits = 11;
    new PowerPlantStandardProject().action(player);
    game.deferredActions.pop()!.execute();
    expect(player.energy).to.eq(1);
  });
});
