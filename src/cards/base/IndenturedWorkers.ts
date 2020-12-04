import {CardType} from '../CardType';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class IndenturedWorkers implements IProjectCard {
    public cardType = CardType.EVENT;
    public cost = 0;
    public tags = [];
    public name = CardName.INDENTURED_WORKERS;

    public getCardDiscount(player: Player, _game: Game) {
      if (player.lastCardPlayed !== undefined && player.lastCardPlayed.name === this.name) {
        return 8;
      }
      return 0;
    }
    public play() {
      return undefined;
    }
    public getVictoryPoints() {
      return -1;
    }
    public metadata: CardMetadata = {
      cardNumber: '195',
      renderData: CardRenderer.builder((b) => {
        b.text('next card', CardRenderItemSize.SMALL, true).colon().megacredits(-8);
      }),
      description: 'The next card you play this generation costs 8 MC less.',
      victoryPoints: -1,
    }
}
