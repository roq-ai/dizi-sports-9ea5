import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CricketLeagueInterface {
  id?: string;
  name: string;
  stats: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface CricketLeagueGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  stats?: string;
  user_id?: string;
}
