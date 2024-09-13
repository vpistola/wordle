var wordle_small = [];
var green = 'G';
var yellow ='Y'; 
var miss = '.';
var correct = 'GGGGG';
var replies_out = [];
//var guesses = 'HELLO, DOLLY';
//var targets = 'HELLO, WORLD, DOLLY, CELLO, ALLEY, HEAVY, HEART, ALLAY, LILAC';

function Counter(array) {
	var count = {};
	array.forEach(val => count[val] = (count[val] || 0) + 1);
	return count;
}

function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      var contents = e.target.result;
      populate_list(contents);
    };
    
    reader.readAsText(file);
}

function displayReplies(contents) {
    var element = document.getElementById('replies');
    element.textContent = contents;
}

function displayRepliesToArea(contents) {
    var element = document.getElementById('replies');
    element.textContent = contents;
}

function populate_list(contents) {
    wordle_small = contents.split('\r\n');
    console.log(wordle_small);
}

function reply_for(guess, target) {
    //The five-character reply for this guess on this target in Wordle.

    var reply = [];
    var target_arr = [];
    var counts;

    // (1) Start by having each reply be either Green or Miss ...
    for (let i=0; i < 5; i++) {
        if (guess[i] == target[i]) {
            reply.push(green);
        } else {
            reply.push(miss);
        }    
    }
    
    // (2) Then change the replies that should be yellow
    for (let i=0; i < 5; i++) {
        if (guess[i] != target[i]) {
            target_arr.push(target[i]);
        }
    }

    counts = Counter(target_arr);
    for (let i=0; i < 5; i++) {
        if (reply[i] == miss && counts[guess[i]] > 0) {
            counts[guess[i]] -= 1;
            reply[i] = yellow;
        }
    }

    //displayReplies(reply.join(''));
    return reply.join('');
}

function replies_for(guesses, target) {
    //A tuple of replies for a sequence of guesses.
    var replies = [];
    var guesses = [];
    var guess_input = document.getElementById('guess').value;
    var target = document.getElementById('target').value;

    guesses = /,/.test(guess_input) ? guess_input.split(',') : [guess_input];

    guesses.forEach(guess => {
        replies.push(reply_for(guess, target));
    });
    displayReplies(replies.join(', '));
}

function consistent_targets(targets, guess, reply) {
    /*All the words in `targets` that give this `reply` to this `guess`.*/
    var out = [];

    targets.forEach(target => {
        if (reply_for(guess, target) == reply) {
            out.push(target);
        }
    })

    return out;
}

function random_guesser(reply, targets) {
    /* Choose a guess at random from the consistent targets. */
    return rdm_choose(targets)
} 

function rdm_choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }
    

function play(guesser, wordlist, target=null, verbose=true) {
    /* The number of guesses it take for `guesser` to guess the Wordle word,
    which is given by `target` or selected from the words in `wordlist`? */
    var targets = wordlist = wordle_small;
    var target  = target || rdm_choose(wordlist)  //Choose a random target if none was given
    var reply = null;
    var guesser=random_guesser; 
    var N = wordlist.length;
    var replies_area = document.getElementById('replies');
    
    //var AA = '';

    for (let turn=1; turn < N + 1; turn++) {
        var guess = guesser(reply, targets);

        if (wordlist.includes(guess)) {
            reply = reply_for(guess, target)
        } else {
            reply = 'unknown';
        }

        targets = consistent_targets(targets, guess, reply);

        if (verbose) {
            let nn = `Guess ${turn}: ${guess}, Reply: ${reply}; Remaining targets: ${targets.length}` + '\n';
            replies_area.textContent += nn;
            //console.log(nn);      
        } 
        if (reply == correct) return turn;
    } 

    console.log(replies_out);
    //displayRepliesToArea(replies.join('\n'));
    return N + 1;
}

/*
assert reply_for('NINNY', 'ANNEX') == 'Y.G..'; assert  reply_for('ANNEX', 'NINNY') == '.YG..'
assert reply_for('HELLO', 'WORLD') == '...GY'; assert  reply_for('WORLD', 'HELLO') == '.Y.G.'
assert reply_for('HELLO', 'ABYSS') == '.....'; assert  reply_for('ABYSS', 'HELLO') == '.....'
assert reply_for('EPEES', 'GEESE') == 'Y.GYY'; assert  reply_for('GEESE', 'EPEES') == '.YGYY'
assert reply_for('WHEEE', 'PEEVE') == '..GYG'; assert  reply_for('PEEVE', 'WHEEE') == '.YG.G'
*/



document.getElementById('file-input').addEventListener('change', readSingleFile, false);
document.querySelector('#reply').addEventListener('click', replies_for);
document.querySelector('#play').addEventListener('click', play.bind(null, random_guesser, wordle_small, null, true));

// document.fonts.ready.then(() => {
//     test_font();
//     upd();
// });