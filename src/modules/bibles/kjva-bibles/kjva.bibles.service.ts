import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class KjvaBiblesService {
  private readonly baseUrl = 'https://bible.helloao.org/api/eng_kja/books.json';

  async getVerse(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}`);
      return response.data.books;
    } catch (error) {
      throw new Error('Error fetching Bible verse');
    }
  }
async getBookWithChapter(bookId:string, chapter:string){
    try{
      const response = await axios.get(`https://bible.helloao.org/api/eng_kja/${bookId}/${chapter}.json`)
      return response.data;
    }catch(error){
      throw new Error('Error fetching Bible verse');
    }
  }
  
}