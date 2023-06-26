import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface LiveScoreInterface {
  id?: string;
  match_id: string;
  score: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface LiveScoreGetQueryInterface extends GetQueryInterface {
  id?: string;
  match_id?: string;
  score?: string;
  user_id?: string;
}
