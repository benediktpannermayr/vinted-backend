import { Injectable } from '@nestjs/common';

export interface ApiInfo {
  name: string;
  status: string;
}

@Injectable()
export class AppService {
  getInfo(): ApiInfo {
    return { name: 'Vinted Reselling API', status: 'ok' };
  }
}
