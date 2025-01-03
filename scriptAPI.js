let teams = [];

document.addEventListener("DOMContentLoaded", function () {
    const leagueDropdown = document.getElementById('leagueSelect');
    const teamDropdown = document.getElementById('teamSelect');
    let addedTeamID = "";
        loadTeamsData();



    const proxyServer = "http://localhost:3000/api";  // Backend proxy server URL

    function populateLeagues() {
        const apiURL = `https://api.football-data.org/v4/competitions`;
        fetch(`${proxyServer}?url=${encodeURIComponent(apiURL)}`)
        .then(response => response.json())
        .then(data => {
            data.competitions.forEach(competition => {
                if (competition.plan === 'TIER_ONE') {
                    const option = document.createElement('option');
                    option.text = competition.name;
                    option.value = competition.id;
                    leagueDropdown.add(option);
                }
            });
        })
        .catch(error => console.error('Error populating leagues:', error));
    }

    function populateTeams(leagueId) {
        const teamsURL = `https://api.football-data.org/v4/competitions/${leagueId}/teams`;

        fetch(`${proxyServer}?url=${encodeURIComponent(teamsURL)}`)
        .then(response => response.json())
        .then(data => {
            teamDropdown.innerHTML = '';
            data.teams.forEach(team => {
                const option = document.createElement('option');
                option.text = team.name;
                option.value = team.id;
                teamDropdown.add(option);
            });
        })
        .catch(error => console.error('Error populating teams:', error));
    }

    leagueDropdown.addEventListener('change', function () {
        const selectedLeagueId = this.value;
        populateTeams(selectedLeagueId);
    });

    teamDropdown.addEventListener('change', function () {
        const selectedTeamId = this.value;
        const teamLogo = document.getElementById('teamImage');
        const teamURL = `https://api.football-data.org/v4/teams/${selectedTeamId}`;
        
        fetch(`${proxyServer}?url=${encodeURIComponent(teamURL)}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.crest) {
                teamLogo.src = data.crest;
                teamLogo.alt = data.name;
                addedTeamID = selectedTeamId;
            }
        })
        .catch(error => console.error('Error fetching team data:', error));
    });

    const addTeamButton = document.getElementById('addTeam');
    addTeamButton.addEventListener('click', function () {
        if (addedTeamID !== "") {
            teams.push(addedTeamID);
            saveTeamsData();
            window.location.reload();
            console.log("added it");
        } else {
            console.error('Cant add team!!!');
        }
    });

    populateLeagues();
});

function removeTeam(index) {
    teams.splice(index, 1);
    saveTeamsData();
    window.location.reload();
}

// Save teams data to localStorage
function saveTeamsData() {
    localStorage.setItem('teams', JSON.stringify(teams));
}

// Load teams data from localStorage
function loadTeamsData() {
    const storedTeams = localStorage.getItem('teams');
    if (storedTeams) {
        teams = JSON.parse(storedTeams);
    } else {
        teams = []; // Return an empty array if no teams are stored
    }
}

