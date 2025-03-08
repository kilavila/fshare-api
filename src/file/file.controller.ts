import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ApiKeyGuard } from 'src/guards/api-key.guard';

@Controller({
  path: 'file',
  version: '1'
})
export class FileController {

  constructor(private fileService: FileService) { }

  /*
   * NOTE: List all files data
   *       ---
   *       Example: <url>/v1/file
   *                x-api-key: <api-key>
   */
  @Get()
  @UseGuards(ApiKeyGuard)
  async getAllFiles() {
    return await this.fileService.getAllFiles();
  }

  /*
   * NOTE: Delete all files
   *       ---
   *       Example: <url>/v1/file
   *                x-api-key: <api-key>
   */
  @Delete()
  @UseGuards(ApiKeyGuard)
  async deleteAllFiles() {
    return await this.fileService.deleteAllFiles();
  }

  /*
   * NOTE: Get file data
   *       ---
   *       @Param {string}  id
   *       @Query {?string} pass
   *       ---
   *       Example: <url>/v1/file/<id>?pass=<password>
   */
  @Get(':id')
  async getFile(
    @Param('id') id: string,
    @Query('pass') password: string,
  ) {
    return await this.fileService.getFile(id, password);
  }

  /*
   * NOTE: Download file
   *       ---
   *       @Param {string}  id
   *       @Query {?string} pass
   *       ---
   *       Example: <url>/v1/file/download/<id>?pass=<password>
   */
  @Get('download/:id')
  async downloadFile(
    @Param('id') id: string,
    @Query('pass') password: string,
  ) {
    return await this.fileService.downloadFile(id, password);
  }

  /*
   * NOTE: Upload file
   *       ---
   *       @Param    {Object}  body
   *       @Property {File}    body.file
   *       @Property {?string} body.password
   *       @Property {?string} body.message
   *       ---
   *       Example: <url>/v1/file
   *                {
   *                  "file": <file>,
   *                  "password": "secret-passphrase",
   *                  "message": "message from sender"
   *                }
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    return await this.fileService.uploadFile(body, file);
  }

  /*
   * NOTE: Delete file
   *       ---
   *       @Param {string}  id
   *       @Query {?string} pass
   *       ---
   *       Example: <url>/v1/file/<id>?pass=<password>
   */
  @Delete(':id')
  async deleteFile(
    @Param('id') id: string,
    @Query('pass') password: string,
  ) {
    return await this.fileService.deleteFile(id, password);
  }

}
