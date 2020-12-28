import Axios from 'axios';
import { Profile, ScoredProfile } from '../interfaces/profile';
import { apiHost } from './Api';

const apiUrl = `${apiHost}/profile`;

export default {
  async getProfiles(token: string): Promise<Array<ScoredProfile>> {
    try {
      const res = await Axios({
        url: `${apiUrl}/list`,
        method: `GET`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return res.data;
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  },

  async getProfile(token: string): Promise<Profile> {
    try {
      const res = await Axios({
        url: `${apiUrl}/`,
        method: `GET`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      return res.data;
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  },

  async startProfile(token: string): Promise<void> {
    try {
      await Axios({
        url: `${apiUrl}/start`,
        method: `POST`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      return;
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  },

  async updateProfile(token: string, profile: Profile): Promise<Profile> {
    try {
      const res = await Axios({
        url: `${apiUrl}/`,
        method: `PUT`,
        data: profile,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      return res.data;
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  },

  async setVisible(token: string, visible: boolean): Promise<Profile> {
    try {
      const res = await Axios({
        url: `${apiUrl}/visible`,
        method: `PUT`,
        data: { visible },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      return res.data;
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  },

  async getSkills(token: string) {
    try {
      const res = await Axios({
        url: `${apiUrl}/skills`,
        method: `GET`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return res.data;
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  },

  async completeTour(token: string, tour: string): Promise<void> {
    try {
      await Axios({
        url: `${apiUrl}/tour/${tour}`,
        method: `POST`,
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