import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SolarProbe implements IProjectCard {
    public cost = 9;
    public tags = [Tags.SPACE, Tags.SCIENCE];
    public name = CardName.SOLAR_PROBE;
    public cardType = CardType.EVENT;

    public play(player: Player) {
      player.drawCard(Math.floor((player.getTagCount(Tags.SCIENCE) + 1) / 3));
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }

    public metadata: CardMetadata = {
      cardNumber: 'C37',
      renderData: CardRenderer.builder((b) => {
        b.cards(1).slash().science(3).digit.played;
      }),
      description: 'Draw 1 card for every 3 science tags you have, including this.',
      victoryPoints: 1,
    }
}
