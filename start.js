let highScores = [];

function showHighscore() {
    document.getElementById('highscore').classList.add('highscore-blend');
    document.getElementById('main-menu').classList.add('menu-blend');
}
function removeHighscore() {
    document.getElementById('highscore').classList.remove('highscore-blend');
    document.getElementById('main-menu').classList.remove('menu-blend');
}


function loadHighscores() {
    highScores = JSON.parse(localStorage.getItem('highScores'));
    highScores.sort(function(score1, score2) {
        return score2.point - score1.point;
    });
    console.log('Loaded highScores', highScores);
    if (highScores[0].name) {
        document.getElementById('name1').innerHTML = highScores[0].name;
        document.getElementById('score1').innerHTML = highScores[0].point;
    }

    if (highScores[1].name) {
        document.getElementById('name2').innerHTML = highScores[1].name;
        document.getElementById('score2').innerHTML = highScores[1].point;
    }
    if (highScores[2].name) {
        document.getElementById('name3').innerHTML = highScores[2].name;
        document.getElementById('score3').innerHTML = highScores[2].point;
    }
    if (highScores[3].name) {
        document.getElementById('name4').innerHTML = highScores[3].name;
        document.getElementById('score4').innerHTML = highScores[3].point;
    }
}