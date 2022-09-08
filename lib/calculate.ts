
import dayjs from "dayjs";
export const calcKillPts = (kills: number): number => {
  return kills * 3;
};

export const calcAssistPts = (assists: number): number => {
  return assists * 2;
};

export const calcDeathPts = (deaths: number): number => {
  return deaths * 0.5;
};

export const calcCreepScorePts = (creepScore: number): number => {
  return creepScore * 0.02;
};

// Calculate Vision Score
export const calcVisionScorePts = (visionScore: number): number => {
  return visionScore * 0.1;
};

export const calcParticipationPts = (kills: number, assists: number, teamTotalKills: number): number => {
  // return ((kills + assists) / Math.max(1, teamTotalKills)) * 100 * 0.25;
  if (((kills + assists) / Math.max(1, teamTotalKills)) * 100 * 0.25 <= 25) {
    return ((kills + assists) / Math.max(1, teamTotalKills)) * 100 * 0.25;
  }

  return 0;
};

export const calcFlawleess = (deaths: number, playerScore: number): number => {
  if (deaths === 0) {
    return playerScore * 1.2;
  }

  return playerScore;
};

// Calculates player score

const addPlayerScore = (
  killPoints: number,
  assistPoints: number,
  creepScorePoints: number,
  visionScorePoints: number,
  participationPoints: number,
  deathsPoints: number
): number => {
  return killPoints + assistPoints + creepScorePoints + visionScorePoints + participationPoints - deathsPoints;
};

// TODO: Implement 0.35x wardPlaced points,
// and 5x firstBloodKill killPoints
// Could not implement above TODO because data was not available
// in API
/**
 *
 * @param playerName
 * @param kills
 * @param assists
 * @param deaths
 * @param creepScore
 * @param teamTotalKills
 * @returns
 */
export function calculatePlayerScore(
  kills: number,
  assists: number,
  deaths: number,
  creepScore: number,
  visionScore: number,
  teamTotalKills: number
): number {
  let killPoints = calcKillPts(kills);
  let assistPoints = calcAssistPts(assists);
  let deathsPoints = calcDeathPts(deaths);
  let creepScorePoints = calcCreepScorePts(creepScore);
  let visionScorePoints = calcVisionScorePts(visionScore);
  let participationPoints = calcParticipationPts(kills, assists, teamTotalKills);
  let playerScore = addPlayerScore(
    killPoints,
    assistPoints,
    creepScorePoints,
    visionScorePoints,
    participationPoints,
    deathsPoints
  );

  playerScore = calcFlawleess(deaths, playerScore);

  return playerScore.toFixed(2) as unknown as number;
}

/**
 * *************** TEAM POINTS CALCULATION ***************
 */

/**
 *
 * @param calcDragonKills
 * @returns
 */
// Calculates dragonKill points
const calcDragonKills = (dragonKills: number): number => {
  return dragonKills * 2;
};

/**
 *
 * @param riftHeraldKills
 * @returns
 */
// Calculates riftHeraldKill points
const calcRiftHeraldKills = (riftHeraldKills: number): number => {
  return riftHeraldKills * 4;
};

/**
 *
 * @param turretKills
 * @returns
 */
// Calculates turretKills points
const calcTurretKills = (turretKills: number): number => {
  return turretKills * 2;
};

/**
 *
 * @param inhibitorKills
 * @returns
 */
// Calculates inhibitorKills points
const calcInhibitorKills = (inhibitorKills: number): number => {
  return inhibitorKills * 4;
};

/**
 *
 * @param baronKills
 * @returns
 */
// Calculates baronKills points
const calcBaronKills = (baronKills: number): number => {
  return baronKills * 10;
};

/**
 *
 * @param dragonKills
 * @param riftHeraldKills
 * @param turretKills
 * @param inhibitorKills
 * @param baronKills
 * @param didWin
 * @returns
 */
// Calculates team points
export const calculateTeamScore = (
  teamKills: number,
  dragonKills: number,
  riftHeraldKills: number,
  turretKills: number,
  inhibitorKills: number,
  baronKills: number,
  didWin: boolean
): number => {
  let dragonKillPts = calcDragonKills(dragonKills);
  let riftHeraldKillPts = calcRiftHeraldKills(riftHeraldKills);
  let turretKillPts = calcTurretKills(turretKills);
  let inhibitorKillPts = calcInhibitorKills(inhibitorKills);
  let baronKillPts = calcBaronKills(baronKills);

  let teamPts: number = teamKills + dragonKillPts + riftHeraldKillPts + turretKillPts + inhibitorKillPts + baronKillPts;

  if (didWin) {
    teamPts += 15;
  } else {
    teamPts -= 15;
  }

  return teamPts;
};


export const calculateLeagueDuration = (startDate: string, endDate: string) => { 
  const startd = dayjs(startDate);
  const endd = dayjs(endDate);
const duration = endd.diff(startd, 'day');

return duration

}
