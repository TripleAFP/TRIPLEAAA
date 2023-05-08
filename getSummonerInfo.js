import key from './apiKey.json' assert {type:'json'};
let KEY = key.key;


// GETTING SUMMONER INFO BY URL

let searchParams = new URLSearchParams(window.location.search);

let summonerName = searchParams.get("summoner");

async function getSummonerInfo(summonerName) {
    const response = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${KEY}`);
    return response.json();
}

async function getLeagueInfo(encriptedId) {
    const response = await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${encriptedId}?api_key=${KEY}`);
    return response.json();
}

async function getMatchIdList(puuid) {
    const response = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=5&api_key=${KEY}`);
    return response.json();
}

async function getMatchInfo(gameId) {
    const response = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${gameId}?api_key=${KEY}`);
    return response.json();
}

function getMatchSummonerData(matchJSON, puuid) {
    let data = undefined;
    matchJSON.info.participants.forEach(function(element){
        if (element.puuid == puuid) {
            data = element;
        }
    });
    return data;
}

function getSummonerName(spellId) {

    if (spellId === 1) {
        return "SummonerBarrier";
      } else if (spellId === 3) {
        return "SummonerExhaust";
      } else if (spellId === 4) {
        return "SummonerFlash";
      } else if (spellId === 6) {
        return "SummonerGhost";
      } else if (spellId === 7) {
        return "SummonerHeal";
      } else if (spellId === 11) {
        return "SummonerSmite";
      } else if (spellId === 12) {
        return "SummonerTeleport";
      } else if (spellId === 13) {
        return "SummonerClarity";
      } else if (spellId === 14) {
        return "SummonerIgnite";
      } else if (spellId === 21) {
        return "SummonerBarrier";
      } else if (spellId === 30) {
        return "SummonerPoroRecall";
      } else if (spellId === 31) {
        return "SummonerPoroThrow";
      } else if (spellId === 32) {
        return "SummonerSnowball";
      }
}

function getQueueName(queueId) {
    if (queueId === 0) {
        return "Custom";
      } else if (queueId === 400) {
        return "Draft Pick";
      } else if (queueId === 420) {
        return "Ranked";
      } else if (queueId === 430) {
        return "Blind";
      } else if (queueId === 440) {
        return "Flex";
      } else if (queueId === 700) {
        return "Clash";
      } else if (queueId === 900) {
        return "ARAM";
      } else {
        return "Unknown";
      }
}

async function printMatchInfo(matchJSON, puuid) {
    const results = document.querySelector('.matches .results');

    let summonerMatchInfo = getMatchSummonerData(matchJSON, puuid);

    results.innerHTML += `
        <div class="matchBox">
                <div class="championBox">
                <img src="http://ddragon.leagueoflegends.com/cdn/13.9.1/img/champion/${summonerMatchInfo.championName}.png" alt="">
                <div class="spells">
                    <img src="http://ddragon.leagueoflegends.com/cdn/13.9.1/img/spell/${getSummonerName(summonerMatchInfo.summoner1Id)}.png" alt="" class="spell">
                    <img src="http://ddragon.leagueoflegends.com/cdn/13.9.1/img/spell/${getSummonerName(summonerMatchInfo.summoner2Id)}.png" alt="" class="spell">
                </div>
            </div>
            <h1 class="gameMode">${getQueueName(matchJSON.info.queueId)}</h1>
            <h1 class="gameResult">${summonerMatchInfo.win ? 'Victory':'Defeat'}</h1>
            <div class="kda"><div class="kills">${summonerMatchInfo.kills}</div>/<div class="deaths">${summonerMatchInfo.deaths} </div>/<div class="assists">${summonerMatchInfo.assists}</div></div>
        </div>
    `;

    return [summonerMatchInfo.kills, summonerMatchInfo.deaths, summonerMatchInfo.assists];
}



async function updatePageInfo() {
    const summonerInfo = await getSummonerInfo(summonerName);
    const leagueInfo = await getLeagueInfo(summonerInfo.id); 

    let nameBox = document.querySelector('.summonerHeader h1');
    nameBox.innerHTML = summonerInfo.name;

    console.log(summonerInfo.puuid)

    let avatarElo = document.querySelector('.avatarElo');
    let avatarEloNumber = document.querySelector('.avatarEloNumber');

    if (leagueInfo[0].tier == 'IRON') {
        avatarElo.style.background = '#6f6f6f';

    } else if (leagueInfo[0].tier == 'BRONZE') {
        avatarElo.style.background = '#866444';

    } else if (leagueInfo[0].tier == 'SILVER') {
        avatarElo.style.background = '#bcbcbc';

    } else if (leagueInfo[0].tier == 'GOLD') {
        avatarElo.style.background = '#ffcf40';

    } else if (leagueInfo[0].tier == 'PLATINUM') {
        avatarElo.style.background = '#95abbb';

    } else if (leagueInfo[0].tier == 'DIAMOND') {
        avatarElo.style.background = '#6eacd9';

    } else if (leagueInfo[0].tier == 'MASTER') {
        avatarElo.style.background = '#590042';

    } else if (leagueInfo[0].tier == 'GRANDMASTER') {
        avatarElo.style.background = '#48066f';

    } else if (leagueInfo[0].tier == 'CHALLENGER') {
        avatarElo.style.background = '#5e899e';
    } else {
        avatarElo.style.background = '#000000';
    }

    avatarEloNumber.innerHTML = leagueInfo[0].rank;

    let levelBox = document.querySelector('.summonerHeader > span p');
    levelBox.innerHTML = `${leagueInfo[0].tier} - Level ${summonerInfo.summonerLevel}`

    let profileIcon = document.querySelector('.summonerHeader img');
    profileIcon.src = `http://ddragon.leagueoflegends.com/cdn/13.9.1/img/profileicon/${summonerInfo.profileIconId}.png`;

    let totalGames = leagueInfo[0].wins + leagueInfo[0].losses;
    let playedBox = document.querySelector('#played');
    playedBox.innerHTML = totalGames;

    let winrateBox = document.querySelector('#winrate');
    winrateBox.innerHTML = `${Math.round((leagueInfo[0].wins / totalGames) * 100)} %`;


    let matchIdList = await getMatchIdList(summonerInfo.puuid);

    let totalKDA = [0, 0, 0];

    for (let i=0; i<5; i++) {
        let gameInfo = await getMatchInfo(matchIdList[i]);
        let currentMatch = await printMatchInfo(gameInfo, summonerInfo.puuid);
        totalKDA[0] += currentMatch[0];
        totalKDA[1] += currentMatch[1];
        totalKDA[2] += currentMatch[2];
    }

    let avgKDA = [totalKDA[0]/5, totalKDA[1]/5, totalKDA[2]/5];

    document.querySelector('.generalInfo .kda .kills').innerHTML = avgKDA[0];
    document.querySelector('.generalInfo .kda .deaths').innerHTML = avgKDA[1];
    document.querySelector('.generalInfo .kda .assists').innerHTML = avgKDA[2];
}

updatePageInfo();
