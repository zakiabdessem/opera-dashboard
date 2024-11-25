import { Controller, Get, HttpStatus, Logger, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('catalogue')
export class CatalogueController {
  @Get('all')
  async findAll(@Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json({ data: [] });
    } catch (error) {
      Logger.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }
}
