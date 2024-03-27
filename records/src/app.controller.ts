import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Record } from './record.class'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRecords(): Record[] {
    return this.appService.getRecords();
  }

  @Get(':id')
  getRecord(@Param('id') id: string): Record {
    const record = this.appService.getRecord(+id)
    if (!record) {
      throw new HttpException("Record not found", HttpStatus.NOT_FOUND)
    }
    return record
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createRecord(@Body("name") name: string, @Body("surname") surname: string): Record {
    if (!name || !surname) {
      throw new HttpException("Fields `name` and `surname` is required", HttpStatus.BAD_REQUEST)
    }
    const record = this.appService.createRecord(name, surname)
    return record
  }
}
