# seq 1 1000 | xargs -I{} npm run testhellas
seq 1 1000 | xargs -I{} npm run test
# npm run pretest
# npm run build
# seq 1 1000 | xargs -I{} mocha dist/tests/Game.spec.js --grep "Removes Hellas bonus ocean space"
