var data;
var members;
var app = new Vue({
    el: '#app',
    data: {
        senators: []
    }
});

 async function fetchJson(url, headers) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': headers
            }
        });
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    }
    catch (error) {
        console.log("json error", error);
    }
};

function renderData(data) {
        return data.results[0].members.map(function (miembro) {
        let middleName = "";
        if (miembro.middle_name != null) {
            middleName = miembro.middle_name;
        }
        let fullName = miembro.first_name + " " + middleName + " " + miembro.last_name;
        let partyVotes = Math.round((miembro.votes_with_party_pct * miembro.total_votes) / 100);
        let senator = {}
        senator.fullName = fullName;
        senator.party = miembro.party;
        senator.state = miembro.state;
        senator.url = miembro.url;
        senator.partyVotes= partyVotes;
        senator.seniority = miembro.seniority;
        senator.missed_votes=miembro.missed_votes;
        senator.missed_votes_pct=miembro.missed_votes_pct;
        senator.votes_with_party_pct = miembro.votes_with_party_pct;
        return senator;
    })
};

//ESTADISTICAS
var statistics = {};
let democrats = [];
let republicans = [];
let independents = [];
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