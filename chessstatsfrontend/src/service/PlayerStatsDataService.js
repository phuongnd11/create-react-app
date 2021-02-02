import axios from 'axios'

const API_URL = 'http://localhost:8080'
const OPENING_URL = `${API_URL}/opening`
const REPORT_URL = `${API_URL}/report`

class PlayerStatsDataService {

    fetchPlayerStats(name) {
        return axios.get(`${OPENING_URL}?playerUsername=` + name);
    }

    fetchOpeningMistakes(playerUsername, openingName) {
        return axios.get(`${OPENING_URL}/mistakes?playerUsername=` + playerUsername + '&openingName=' + openingName);
    }

    fetchOverview(playerUsername) {
        return axios.get(`${REPORT_URL}/overview?playerUsername=` + playerUsername);
    }

    fetchWinrateByDay(playerUsername) {
        return axios.get(`${REPORT_URL}/winratebyday?playerUsername=` + playerUsername);
    }
}


export default new PlayerStatsDataService()