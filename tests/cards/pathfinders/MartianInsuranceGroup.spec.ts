import {expect} from 'chai';
import {MartianInsuranceGroup} from '../../../src/cards/pathfinders/MartianInsuranceGroup';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {fakeCard} from '../../TestingUtils';
import {CardType} from '../../../src/common/cards/CardType';
import {Resources} from '../../../src/common/Resources';

describe('MartianInsuranceGroup', function() {
  let card: MartianInsuranceGroup;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new MartianInsuranceGroup();
    game = newTestGame(2);
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player.setCorporationForTest(card);
  });

  it('when you play an event', function() {
    const event = fakeCard({name: 'A' as CardName, cardType: CardType.EVENT});
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    expect(player2.getProduction(Resources.MEGACREDITS)).eq(0);
    player.playCard(event);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);
    expect(player2.getProduction(Resources.MEGACREDITS)).eq(0);
  });

  it('when opponent plays an event', function() {
    const event = fakeCard({name: 'A' as CardName, cardType: CardType.EVENT});
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    expect(player2.getProduction(Resources.MEGACREDITS)).eq(0);
    player2.playCard(event);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    expect(player2.getProduction(Resources.MEGACREDITS)).eq(0);
  });
});
