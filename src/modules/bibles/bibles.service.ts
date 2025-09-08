// src/bible/bible.service.ts

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BibleService {
  private readonly baseUrl = 'https://bible-api.com/data/';

  async getVerse(reference: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}${reference}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching Bible verse');
    }
  }
}