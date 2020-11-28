import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class ConvoyFromEuropa implements IProjectCard {
    public cost = 15;
    public tags = [Tags.SPACE];
    public cardType = CardType.EVENT;
    public name = CardName.CONVOY_FROM_EUROPA;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
      const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oceansMaxed) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, true);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      player.cardsInHand.push(game.dealer.dealCard());
      game.defer(new PlaceOceanTile(player, game));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '161',
      description: 'Place 1 ocean tile and draw 1 card',
      renderData: CardRenderer.builder((b) => b.oceans(1).cards(1)),
    }
}
