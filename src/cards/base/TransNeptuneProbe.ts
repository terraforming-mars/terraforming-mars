import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';

export class TransNeptuneProbe implements IProjectCard {
    public cost = 6;
    public tags = [Tags.SCIENCE, Tags.SPACE];
    public name = CardName.TRANS_NEPTUNE_PROBE;
    public cardType = CardType.AUTOMATED;

    public play() {
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '084',
      victoryPoints: 1,
    }
}
