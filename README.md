# Wordle

Wordle is Josh Wardle's popular word game in which a guesser tries to guess a secret target word (chosen from a word list of allowable words) in as few guesses as possible. Each guess must be one of the words on the list, and the reply to each guess consists of 5 bits (actually trits) of information, one for each of the 5 word spots:

- Green if the guess letter is in the word and in the correct spot.
- Yellow if the guess letter is in the word but in the wrong spot.
- Miss if the letter is not in the word in any spot.

This repository contains code to play the game. You can click the Reply button for checking the reply for a single guess/target and the Play button to play a game.