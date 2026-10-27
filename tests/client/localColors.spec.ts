import {expect} from 'chai';
import {FakeLocalStorage} from './components/FakeLocalStorage';
import {PreferencesManager} from '../../src/client/utils/PreferencesManager';
import {localColors, localPlayerView, resetLocalColorsForTest, serverColor} from '../../src/client/utils/localColors';
import {PlayerViewModel} from '../../src/common/models/PlayerModel';
import {LogMessageDataType} from '../../src/common/logs/LogMessageDataType';

describe('localColors', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
    PreferencesManager.resetForTest();
    PreferencesManager.INSTANCE.set('my_color', 'green');
  });
  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
    PreferencesManager.resetForTest();
    resetLocalColorsForTest();
  });

  it('swaps the viewer with whoever has the chosen color', () => {
    const model = {
      thisPlayer: {color: 'red', name: 'red'},
      players: [{color: 'red'}, {color: 'green'}, {color: 'blue'}],
      game: {spaces: [{id: '01', color: 'green'}], turmoil: {lobby: ['red', 'blue']}},
      waitingFor: {type: 'player', players: ['green', 'blue']},
    } as unknown as PlayerViewModel;

    expect(localPlayerView(model)).deep.eq({
      thisPlayer: {color: 'green', name: 'red'},
      players: [{color: 'green'}, {color: 'red'}, {color: 'blue'}],
      game: {spaces: [{id: '01', color: 'red'}], turmoil: {lobby: ['green', 'blue']}},
      waitingFor: {type: 'player', players: ['red', 'blue']},
    });
    // The player shown in red really is green.
    expect(serverColor('red')).eq('green');
    expect(serverColor('blue')).eq('blue');
  });

  it('swaps players in log messages', () => {
    localPlayerView({thisPlayer: {color: 'red'}} as PlayerViewModel);

    expect(localColors([{data: [
      {type: LogMessageDataType.PLAYER, value: 'red'},
      {type: LogMessageDataType.STRING, value: 'red'},
    ]}])).deep.eq([{data: [
      {type: LogMessageDataType.PLAYER, value: 'green'},
      {type: LogMessageDataType.STRING, value: 'red'},
    ]}]);
  });
});
