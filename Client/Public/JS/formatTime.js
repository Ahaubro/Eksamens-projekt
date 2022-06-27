//Function that formats time by adding 0's
function formatTime(time) {

    if (time < 10) {

        return '0' + time;
    }
    return time;
}
