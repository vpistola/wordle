var wordle_small = [];
var green = 'G';
var yellow ='Y'; 
var miss = '.';
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

/*

*/



document.getElementById('file-input').addEventListener('change', readSingleFile, false);
document.querySelector('#reply').addEventListener('click', replies_for);

// document.fonts.ready.then(() => {
//     test_font();
//     upd();
// });