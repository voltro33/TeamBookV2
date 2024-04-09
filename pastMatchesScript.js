function fetchLastFiveMatches(teamId, numMatches) {
    const url = `https://corsproxy.io/?https://api.football-data.org/v2/teams/${teamId}/matches?status=FINISHED&limit=${numMatches}`;
    const headers = {
        'Token': 'be3a4a0da29649b49f4e2993959b7c28'
    };

    fetch(url, { headers })
        .then(response => {
          
            return response.json();
        })
        .then(data => {
            const lastFiveMatches = data.matches;
            const matchesContainer = document.getElementById('matches');
            matchesContainer.innerHTML = '';
            lastFiveMatches.forEach(match => {
                Promise.all([
                    findImage(match.homeTeam.id),
                    findImage(match.awayTeam.id)
                ]).then(([homeLogo, awayLogo]) => {
                    const matchElement = document.createElement('div');
                    matchElement.classList.add('match');

                    const homeLogoElement = document.createElement('img');
                    homeLogoElement.src = homeLogo;
                    homeLogoElement.alt = match.homeTeam.name + ' Logo';
                    matchElement.appendChild(homeLogoElement);

                    const competitionElement = document.createElement('p');
                    competitionElement.textContent = match.competition.name;
                    matchElement.appendChild(competitionElement);

                    const awayLogoElement = document.createElement('img');
                    awayLogoElement.src = awayLogo;
                    awayLogoElement.alt = match.awayTeam.name + ' Logo';
                    matchElement.appendChild(awayLogoElement);

                    const matchInfoElement = document.createElement('p');
                    const matchDate = new Date(match.utcDate);
                    const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const formattedDate = formatter.format(matchDate);
                    matchInfoElement.textContent = formattedDate;
                    matchElement.appendChild(matchInfoElement);

                    matchesContainer.appendChild(matchElement);
                })
            });
        })
}

function findImage(teamID) {
    return fetch(`https://corsproxy.io/?https://api.football-data.org/v2/teams/${teamID}`, {
        headers: {
            'Token': 'be3a4a0da29649b49f4e2993959b7c28'
        }
    })
    .then(response => {
       
        return response.json();
    })
    .then(data => {
        if (data && data.crestUrl) {
            return data.crestUrl;
        } 
    })
}

function getTeamIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('teamId');
}

const teamId = getTeamIdFromUrl();

function goFutureMatch() {
    window.location.href = `futureMatches.html?teamId=${teamId}`;
}

fetchLastFiveMatches(teamId, 2);
