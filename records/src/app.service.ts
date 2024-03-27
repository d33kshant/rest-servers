import { Injectable } from '@nestjs/common'
import { Record } from './record.class'

@Injectable()
export class AppService {
  records: Record[]

  constructor() {
    this.records = []
  }

  createRecord(name: string, surname: string): Record {
    const record: Record = {
      id: this.records.length + 1,
      name,
      surname,
      datecreation: new Date(),
    }
    this.records.push(record)
    return record
  }

  getRecord(id: number): Record | null {
    return this.records.find(record => record.id === id)
  }

  getRecords(): Record[] {
    return this.records
  }
}
