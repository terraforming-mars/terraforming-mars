import {expect} from 'chai';
import {ResearchAndDevelopment} from '@/server/automa/bonusCards/ResearchAndDevelopment';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {Mine} from '@/server/cards/base/Mine';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('ResearchAndDevelopment', () => {
  it('resolves the top project card', () => {
    const played: Array<IProjectCard> = [];
    const {marsBot} = recordingMarsBot({resolveProjectCard: (card) => played.push(card)});
    const mine = new Mine();
    marsBot.game.projectDeck.drawPile.push(mine);

    const destroyed = new ResearchAndDevelopment().resolve(marsBot);

    expect(played).deep.eq([mine]);
    expect(destroyed).is.false;
  });
});
