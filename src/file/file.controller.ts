import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { ApiExcludeEndpoint, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { File } from 'node:buffer';

@ApiTags('File management')
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
  @ApiExcludeEndpoint(true)
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
  @ApiExcludeEndpoint(true)
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
  @ApiResponse({
    status: 200,
    example: {
      "id": "cm80lde0l0000r9umrqfb6zms",
      "createdAt": "2025-03-08T19:22:45.429Z",
      "path": "uploads/1741461764354-archive.tar.gz",
      "message": "message from sender"
    }
  })
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiQuery({
    name: 'pass',
    required: false,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Default response: Streamable file'
  })
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiQuery({
    name: 'pass',
    required: false,
  })
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
  @ApiResponse({
    status: 201,
    description: 'Default response',
    example: {
      "id": "cm80lde0l0000r9umrqfb6zms",
      "createdAt": "2025-03-08T19:22:45.429Z",
      "path": "uploads/1741461764354-archive.tar.gz",
      "message": "message from sender"
    }
  })
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
  @ApiResponse({
    status: 200,
    description: 'Default response',
    example: {
      "id": "cm80lde0l0000r9umrqfb6zms",
      "createdAt": "2025-03-08T19:22:45.429Z",
      "path": "uploads/1741461764354-archive.tar.gz",
      "message": "message from sender"
    }
  })
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiQuery({
    name: 'pass',
    required: false,
  })
  async deleteFile(
    @Param('id') id: string,
    @Query('pass') password: string,
  ) {
    return await this.fileService.deleteFile(id, password);
  }

}
