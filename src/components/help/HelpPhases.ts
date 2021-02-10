import Vue from 'vue';

export const HelpPhases = Vue.component('help-phases', {
  components: {
  },
  methods: {
  },
  template: `
    <div class="help-page-phases-container">

      <ul>

        <li>
        <input type="checkbox" id="initial-draft">
        <label for="initial-draft" class="first">Initial Drafting (optional variant)</label>
          <ul>
            <li>Draw 3 corporation cards</li>
            <li>Draw 4 prelude cards <div class="expansion-icon expansion-icon-prelude"></li>
            <li>Draw 5 project cards. Draft. Pick one card and pass to the player above in turn order. Repeat until you have 5 cards.</li>
            <li>Draw 5 more project cards. Draft and pass to the player below in turn order instead.</li>
            <li>Draft the prelude cards. Pick one card and pass to the player above in turn order. Repeat until you have 4 preludes.
              <div class="expansion-icon expansion-icon-prelude"></div>
            </li>
          </ul>
        </li>

        <li>
          <input type="checkbox" id="initial-research">
          <label for="initial-research">Initial Research Phase</label>
          <ul>
            <li>Select which corporation, 2 preludes and project cards to keep.</li>
            <li>In turn order, play the corporation and pay 3 mc for each of the kept project cards.</li>
            <li>In turn order, play both preludes. <div class="expansion-icon expansion-icon-prelude"></div></li>
          </ul>
        </li>

        <li>
          <input type="checkbox" id="generation">
          <label for="generation">Each generation</label>
          <ul>
            <li>
            <input type="checkbox" id="action-phase">
            <label for="action-phase" class="last">Action phase (Turmoil policy in effect <div class="expansion-icon expansion-icon-turmoil"></div>) </label> 
            <ul>
              <li>Take 1 or 2 actions (mandatory 2 actions if playing with fast mode):
                <ul>
                  <li>play card</li>
                  <li>use active (blue) card action</li>
                  <li>standard project</li>
                  <li>convert plants to greenery</li>
                  <li>convert heat to temperature</li>
                  <li>claim milestone</li>
                  <li>fund award</li>
                  <li>trade with 9 mc, 3 Ti, or 3 energy <div class="expansion-icon expansion-icon-colony"></div></li>
                  <li>lobby: one is free, 5 mc per delegate after <div class="expansion-icon expansion-icon-turmoil"></div></li>
                </ul>
              </li>
              <li>Pass for the generation</li>
            </ul>
            </li>

            <li>
            <input type="checkbox" id="production-phase">
            <label for="production-phase">Production Phase</label>
            <ul>
              <li> Energy becomes heat </li>
              <li> Produce resources </li>
            </ul>
            </li>

            <li>
            <input type="checkbox" id="solar-phase">
            <label for="solar-phase">Solar Phase</label>
            <ul>
              <li> i. Game end check 
                <ul>
                  <li>If temperature, oxygen, and oceans are maxed, skip the rest of solar phase to end game phase. </li>
                  <li>(If playing solo, Venus track must be completed as well.) </li>
                </ul>
              <li> ii. World Government Terraforming (start player chooses) <div class="expansion-icon expansion-icon-venus"></div></li>
              <li> iii. Colony production
                <ul>
                  <li>Trade fleets return</li>
                  <li>Each colony marker goes up one step</li>
                </ul>
              </li>

              <li> iv. Turmoil 
                <ul>
                  <li> 1. TR Revision: All players lose 1 TR </li>
                  <li> 2. Global Event: Perform the current Global Event </li>
                  <li> 3. New Government
                    <ul>
                    <li> Change policy tile </li>
                    <li> Perform the ruling bonus of the dominant party </li>
                    <li> The dominant party leader becomes chairman, earning 1 TR. </li>
                    <li> Move the old chairman and all other delegates from the dominant party to the reserves. </li>
                    <li> Shift the dominance marker. In case of tie, the party closest to the left of the previous dominant party becomes dominant. </li>
                    <li> Restore lobby </li>
                    </ul>
                  </li>
                  <li> 4. Changing Times
                    <ul>
                      <li> Move the coming (middle) Global Event to current position (right). Add its lower neutral delegate.</li>
                      <li> Move the distant (left) Global Event to coming position (middle) </li>
                      <li> Reveal a new Global Event in the distant (left) position. Add its top neutral delegate </li>
                    </ul>
                  </li>
                </ul>
              </li>
            <ul>
            </li>

          </ul>
        </li>


        <li>
          <input type="checkbox" id="end-game">
          <label for="end-game">End Game</label>
          <ul>
            <li> In turn order, convert plants to greeneries. </li>
            <li> Assign awards </li>
            <li> Score: TR + tiles + card + milestones + awards + (1 VP per chairman and party leader <div class="expansion-icon expansion-icon-turmoil"></div>)</li>
          </ul>
        </li>

      </ul>

    </div>
    `,
});
