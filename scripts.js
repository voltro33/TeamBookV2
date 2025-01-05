

let teams2 = [];
 const inactivityMessage = document.getElementById("hiddenId");

function showCards() {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";
    const templateCard = document.querySelector(".card");

    for (let i = 0; i < teams2.length; i++) {

        let teamID = parseInt(teams2[i].replace(/\D/g, ''), 10);

        const nextCard = templateCard.cloneNode(true);
        editCardContent(nextCard, teamID, i);
        cardContainer.appendChild(nextCard);
    }
    console.log(teams2.length);
}


document.addEventListener("DOMContentLoaded", function() {
    displayTeamList();
    showCards();
});

function quoteAlert() {
    console.log("Button Clicked!")
    alert("Life could be a dream...!");
}


function displayTeamList() {
    teams2 = loadTeamsData(); 
    console.log("Team List:", teams2);
}


function editCardContent(card, teamID, i) {
  // const proxyServer = "http://localhost:3000/api"; // Use your proxy server OLD ONE
       const proxyServer = "https://teambookv2.onrender.com/api"; // NEW Render proxy server 

    const apiURL = `https://api.football-data.org/v4/teams/${teamID}`;
    
    fetch(`${proxyServer}?url=${encodeURIComponent(apiURL)}`)
    .then(response => response.json())
    .then(data => {
        if (data && data.crest) {
            const teamName = data.name;
            const teamLogoURL = data.crest;
            
            card.style.display = "block";

            const cardHeader = card.querySelector("h2");
            cardHeader.textContent = teamName;

            const cardImage = card.querySelector("img");
            cardImage.src = teamLogoURL;
            cardImage.alt = teamName + " Logo";

            const teamInfo = document.createElement('div');
            teamInfo.innerHTML = `
            <button style="background-color: rgb(0, 180, 251);" class="view-button">View</button>
                <button style="background-color: rgb(251, 79, 0);" class="removeTeam">Remove Team</button> 
            `;
            card.appendChild(teamInfo);

            const removeButton = teamInfo.querySelector('.removeTeam');
            removeButton.addEventListener('click', function() {
                removeTeam(i);   
            });

            const viewButton = teamInfo.querySelector('.view-button');
            viewButton.addEventListener('click', function() {
                window.location.href = `pastMatches.html?teamId=${teamID}`;
            });

        } 
    })
}

function removeTeam(index) {
    teams2.splice(index, 1);
    saveTeamsData();
    window.location.reload();
}

function saveTeamsData() {
    localStorage.setItem('teams', JSON.stringify(teams2));
}

function loadTeamsData() {
    const storedTeams = localStorage.getItem('teams');
    if (storedTeams) {
        teams2 = JSON.parse(storedTeams);
    } 
    if (teams2.length === 0) {
    inactivityMessage.classList.toggle('hidden', false); 
} else {
    inactivityMessage.classList.toggle('hidden', true);  
}
    return teams2;
}

