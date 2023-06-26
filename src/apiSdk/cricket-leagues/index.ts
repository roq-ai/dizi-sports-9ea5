import axios from 'axios';
import queryString from 'query-string';
import { CricketLeagueInterface, CricketLeagueGetQueryInterface } from 'interfaces/cricket-league';
import { GetQueryInterface } from '../../interfaces';

export const getCricketLeagues = async (query?: CricketLeagueGetQueryInterface) => {
  const response = await axios.get(`/api/cricket-leagues${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCricketLeague = async (cricketLeague: CricketLeagueInterface) => {
  const response = await axios.post('/api/cricket-leagues', cricketLeague);
  return response.data;
};

export const updateCricketLeagueById = async (id: string, cricketLeague: CricketLeagueInterface) => {
  const response = await axios.put(`/api/cricket-leagues/${id}`, cricketLeague);
  return response.data;
};

export const getCricketLeagueById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/cricket-leagues/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCricketLeagueById = async (id: string) => {
  const response = await axios.delete(`/api/cricket-leagues/${id}`);
  return response.data;
};
