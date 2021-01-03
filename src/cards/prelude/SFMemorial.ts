import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {DrawCards} from '../../deferredActions/DrawCards';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SFMemorial implements IProjectCard {
    public cost = 7;
    public tags = [Tags.BUILDING];
    public name = CardName.SF_MEMORIAL;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      game.defer(new DrawCards(player, game, 1));
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }

    public metadata: CardMetadata = {
      cardNumber: 'P41',
      renderData: CardRenderer.builder((b) => b.cards(1)),
      description: 'Draw 1 card.',
      victoryPoints: 1,
    }
}
