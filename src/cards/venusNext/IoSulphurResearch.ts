import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class IoSulphurResearch implements IProjectCard {
    public cost = 17;
    public tags = [Tags.SCIENCE, Tags.JOVIAN];
    public name = CardName.IO_SULPHUR_RESEARCH;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      if (player.getTagCount(Tags.VENUS) >= 3) {
        player.cardsInHand.push(
          game.dealer.dealCard(),
          game.dealer.dealCard(),
          game.dealer.dealCard(),
        );
        return undefined;
      }
      player.cardsInHand.push(game.dealer.dealCard());
      return undefined;
    }
    public getVictoryPoints() {
      return 2;
    }
    public metadata: CardMetadata = {
      cardNumber: '232',
      renderData: CardRenderer.builder((b) => {
        b.cards(1).br;
        b.or().br;
        b.venus(3).played.digit.colon().cards(3);
      }),
      description: 'Draw 1 card, or draw 3 if you have at least 3 Venus tags.',
      victoryPoints: 2,
    };
}
