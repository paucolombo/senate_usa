var statistics = {};
let democrats = [];
let republicans = [];
let independents = [];
const members = data.results[0].members;
let votes_party = 0;

function getStaticData(members) {
    for (var clave in members) {
        if (members[clave].party === "D") {
            democrats.push(members[clave]);
        } else if (members[clave].party === "R") {
            republicans.push(members[clave]);
        } else if (members[clave].party === "I") {
            independents.push(members[clave]);
        }
    }
}

getStaticData(members);

function getPctVotes(arr) {
    votes_party = 0;
    if (arr.length === 0) {
        return 0;
    }
    for (let i = 0; i < arr.length; i++) {
        votes_party += arr[i].votes_with_party_pct;
    }
    return votes_party / arr.length;
}

function getTenPercent(members) {
    return Math.round((members.length * 10) / 100);
}

function getStaticsVotes(arr, value, order) {
    let newArr = [];
    arr.sort(function (a, b) {
        if (order === 'desc') {
            return a[value] - b[value];
        } else {
            return b[value] - a[value];
        }
    });
    for (let i = 0; i < statistics.tenPercent; i++) {
        newArr.push(arr[i]);
    }

    return newArr;
}

function getStaticObject() {
    statistics.democrats_pctvotes_party = getPctVotes(democrats);
    statistics.republicans_pctvotes_party = getPctVotes(republicans);
    statistics.independents_pctvotes_party = getPctVotes(independents);
    statistics.totalPctVotes = (statistics.democrats_pctvotes_party + statistics.republicans_pctvotes_party + statistics.independents_pctvotes_party) / 3;
    statistics.totalPctVotes = statistics.totalPctVotes.toPrecision(4);
    statistics.democrats_pctvotes_party = statistics.democrats_pctvotes_party.toPrecision(4) + "%";
    statistics.republicans_pctvotes_party = statistics.republicans_pctvotes_party.toPrecision(4) + "%";
    statistics.independents_pctvotes_party = statistics.independents_pctvotes_party.toPrecision(4) + "%";
    statistics.tenPercent = getTenPercent(members);
    statistics.members_pct_most_missedvotes = getStaticsVotes(members, 'missed_votes_pct', 'asc');
    statistics.members_pct_least_missedvotes = getStaticsVotes(members, 'missed_votes_pct', 'desc');
    statistics.members_pct_most_partyvotes = getStaticsVotes(members, 'votes_with_party_pct', 'asc');
    statistics.members_pct_least_partyvotes = getStaticsVotes(members, 'votes_with_party_pct', 'desc');
    statistics.num_democrats = democrats.length;
    statistics.num_republicans = republicans.length;
    statistics.num_independents = independents.length;
    statistics.totalVotes = statistics.num_democrats + statistics.num_republicans + statistics.num_independents;
}

getStaticObject();
//Senate At Glance Table
function getColumnsHtml(data) {
    return ("<tr><td>" + "Democrates" + "</td><td>" + data.num_democrats + "</td><td>" + data.democrats_pctvotes_party + "</td></tr>" + "<tr><td>" + "Republicans" + "</td><td>" + data.num_republicans + "</td><td>" + data.republicans_pctvotes_party + "</td></tr>" + "<tr><td>" + "Independents" + "</td><td>" + data.num_independents + "</td><td>" + data.independents_pctvotes_party + "</td></tr>" + "<tr><td>" + "Total" + "</td><td>" + data.totalVotes + "</td><td>" + data.totalPctVotes + "</tr></td>"
    );
}

function renderRows(data) {
    var html = getColumnsHtml(data);
    document.getElementById("table‐rows").innerHTML = html;
}
//LEAST LOYAL TABLE,MOST LOYAL TABLE, ENGAGED TABLES
function getTable(estadisticas, tabla) {
    return estadisticas.map(function (miembro) {
        console.log("miembro ", miembro.votes_with_party_pct)
        let middleName = "";
        if (miembro.middle_name != null) {
            middleName = miembro.middle_name;
        }
        let fullName = "<a href=" + miembro.url + " target='_blank'" + ">" + miembro.first_name + " " + middleName + " " + miembro.last_name + "</a>";
        if ((tabla === "mostLoyalTable") || (tabla === "leastLoyalTable")) {
            let partyVotes = Math.round((miembro.votes_with_party_pct * miembro.total_votes) / 100);
            return "<tr><td>" + fullName + "</td><td>" + partyVotes + "</td><td>" + miembro.votes_with_party_pct + "%" + "</td></tr>";
        } else {
            let fullName = "<a href=" + miembro.url + " target='_blank'" + ">" + miembro.first_name + " " + middleName + " " + miembro.last_name + "</a>";
            return "<tr><td>" + fullName + "</td><td>" + miembro.missed_votes + "</td><td>" + miembro.missed_votes_pct + "%" + "</td></tr>";
        }
    }).join("");
}

function renderTable(data, tabla) {
    var html = getTable(data, tabla);
    document.getElementById(tabla).innerHTML = html;
}