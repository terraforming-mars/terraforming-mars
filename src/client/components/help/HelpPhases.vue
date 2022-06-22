<template>
    <div class="help-phases-container">
      <ul>
        <li>
          <input type="checkbox" id="initial-draft">
          <label for="initial-draft" class="first"><span v-i18n>Initial Drafting (optional variant)</span></label>
            <ul>
              <li v-i18n>Draw 3 corporation cards</li>
              <li v-i18n>Draw 4 prelude cards <div class="expansion-icon expansion-icon-prelude"></div></li>
              <li v-i18n>Draw 5 project cards. Draft. Pick one card and pass to the player above in turn order. Repeat until you have 5 cards.</li>
              <li v-i18n>Draw 5 more project cards. Draft and pass to the player below in turn order instead.</li>
              <li>
                <span v-i18n>Draft the prelude cards. Pick one card and pass to the player above in turn order. Repeat until you have 4 preludes.</span>
                <div class="expansion-icon expansion-icon-prelude"></div>
              </li>
            </ul>
        </li>
        <li>
          <input type="checkbox" id="generation">
          <label for="generation"><span v-i18n>Each generation</span></label>
          <ul>
            <li>
              <input type="checkbox" id="initial-research">
              <label for="initial-research" v-i18n><span v-i18n>Initial Research Phase (Generation 1 only)</span></label>
              <ul>
                <li v-i18n>Select which corporation, 2 preludes and project cards to keep.</li>
                <li v-i18n>In turn order, play the corporation and pay 3 M€ for each of the project cards bought.</li>
                <li>
                  <span v-i18n>In turn order, play both preludes.</span>
                  <div class="expansion-icon expansion-icon-prelude"></div>
                </li>
              </ul>
            </li>
            <li>
              <input type="checkbox" id="research-phase">
              <label for="research-phase"><span v-i18n>Research Phase (Generation 2+)</span></label>
              <ul>
                <li v-i18n>Draw four project cards</li>
                <li v-i18n>(Optional variant: draft the cards. Pick one pass to the player below in even generation and above in odd generation. Repeat until you have four cards.)</li>
                <li v-i18n>Decide how many cards to buy</li>
              </ul>
            </li>
            <li>
              <input type="checkbox" id="action-phase">
              <label for="action-phase" class="last">
                <span v-i18n>Action phase</span>
                (<span v-i18n>Turmoil policy in effect</span>
                <div class="expansion-icon expansion-icon-turmoil"></div>
                )
              </label>
              <ul>
                <li><span v-i18n>Take 1 or 2 actions (mandatory 2 actions if playing with fast mode):</span>
                  <ul>
                    <li v-i18n>play card</li>
                    <li v-i18n>use active card action</li>
                    <li v-i18n>standard project</li>
                    <li v-i18n>convert plants to greenery</li>
                    <li v-i18n>convert heat to temperature</li>
                    <li v-i18n>claim milestone</li>
                    <li v-i18n>fund award</li>
                    <li>
                      <span v-i18n>trade with 9 M€, 3 Ti, or 3 energy</span>
                      <div class="expansion-icon expansion-icon-colony"></div>
                    </li>
                    <li>
                      <span v-i18n>send delegate: free from lobby, 5 M€ from reserve</span>
                      <div class="expansion-icon expansion-icon-turmoil"></div>
                    </li>
                  </ul>
                </li>
                <li v-i18n>Pass for the generation</li>
              </ul>
            </li>
            <li>
              <input type="checkbox" id="production-phase">
              <label for="production-phase"><span v-i18n>Production Phase</span></label>
              <ul>
                <li v-i18n>Energy becomes heat</li>
                <li v-i18n>Produce resources</li>
              </ul>
            </li>
            <li>
              <input type="checkbox" id="solar-phase">
              <label for="solar-phase"><span v-i18n>Solar Phase</span></label>
              <ul>
                <li><span v-i18n>i. Game end check</span>
                  <ul>
                    <li v-i18n>If temperature, oxygen, and oceans are maxed, skip the rest of solar phase to the end game phase. </li>
                    <li v-i18n>(If playing solo, the game ends after 14 generations.)</li>
                    <li v-i18n>Solo mode adjustments for expansions:</li>
                    <li v-i18n>• Prelude: The game ends 2 generations earlier.</li>
                    <li v-i18n>• Venus Next: The Venus track must be completed for solo mode victory.</li>
                    <li v-i18n>• The Moon (63TR condition): No changes.</li>
                    <li v-i18n>• The Moon (Terraforming condition): The game ends 2 generations later. The Moon must tracks must be completed for solo mode victory.</li>
                  </ul>
                <li>
                  <span v-i18n>ii. World Government Terraforming (start player chooses)</span>
                  <div class="expansion-icon expansion-icon-venus"></div>
                </li>
                <li><span v-i18n>iii. Colony production</span>
                  <ul>
                    <li v-i18n>Trade fleets return</li>
                    <li v-i18n>Each colony tile track is increased 1 step if possible</li>
                  </ul>
                </li>
                <li><span v-i18n>iv. Turmoil</span><div class="expansion-icon expansion-icon-turmoil"></div>
                  <ul>
                    <li v-i18n>1. TR Revision: All players lose 1 TR</li>
                    <li v-i18n>2. Global Event: Perform the current Global Event</li>
                    <li>
                      <span v-i18n>3. New Government</span>
                      <ul>
                        <li v-i18n>Change policy tile</li>
                        <li v-i18n>Perform the ruling bonus of the dominant party</li>
                        <li v-i18n>The dominant party leader becomes chairman, earning 1 TR.</li>
                        <li v-i18n>Move the old chairman and all other delegates from the dominant party to the reserves.</li>
                        <li v-i18n>Shift the dominance marker. In case of tie, the party closest to the left of the previous dominant party becomes dominant.</li>
                        <li v-i18n>Restore lobby</li>
                      </ul>
                    </li>
                    <li>
                      <span v-i18n>4. Changing Times</span>
                      <ul>
                        <li v-i18n>Move the coming (middle) Global Event to current position (right). Add its lower neutral delegate.</li>
                        <li v-i18n>Move the distant (left) Global Event to coming position (middle)</li>
                        <li v-i18n>Reveal a new Global Event in the distant (left) position. Add its top neutral delegate</li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <input type="checkbox" id="end-game">
          <label for="end-game"><span v-i18n>End Game</span></label>
          <ul>
            <li v-i18n>In turn order, convert plants to greeneries.</li>
            <li v-i18n>Assign awards</li>
            <li>
              <span v-i18n> Score: TR + tiles + card + milestones + awards + (1 VP per chairman and party leader</span>
              <div class="expansion-icon expansion-icon-turmoil"></div>)
            </li>
          </ul>
        </li>
      </ul>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'HelpPhases',
});
</script>
