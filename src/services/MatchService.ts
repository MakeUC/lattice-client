import Axios from 'axios';
import { Swipe } from '../interfaces/match';
import { apiHost } from './Api';

const apiUrl = `${apiHost}/match`;

export default {
  async swipe(token: string, swipe: Pick<Swipe, 'to' | 'like'>) {
    try {
      const res = await Axios({
        url: `${apiUrl}`,
        method: `POST`,
        data: swipe,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return res.data;
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  },
  async reset(token: string): Promise<void> {
    try {
      await Axios({
        url: `${apiUrl}`,
        method: `DELETE`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return;
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  }
};