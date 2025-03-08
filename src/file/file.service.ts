import { StreamableFile, Injectable, NotFoundException, UnauthorizedException, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as bcrypt from 'bcrypt';
import { createReadStream, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FileService {

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private prisma: PrismaService
  ) { }

  /*
   * NOTE: Cronjob: delete file after X hours
   *       ---
   *       @Param {string} id
   *       @Param {string} name
   *       @Param {string} hours
   */
  addCronJob(id: string, name: string) {
    const job = new CronJob(`59 59 23 * * 0`, async () => {
      const data = await this.prisma.file.delete({ where: { id } });

      if (existsSync(data.path)) {
        unlinkSync(data.path);
      } else {
        throw new NotFoundException();
      }

      this.schedulerRegistry.deleteCronJob(name);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  /*
   * NOTE: Get all files data
   */
  async getAllFiles() {
    return await this.prisma.file.findMany();
  }

  /*
   * NOTE: Delete all files data
   *       *Does NOT delete the files!*
   */
  async deleteAllFiles() {
    return await this.prisma.file.deleteMany();
  }

  /*
   * NOTE: Get file data
   *       ---
   *       @Param {string}  id
   *       @Param {?string} pass
   */
  async getFile(id: string, pass: string) {
    const data = await this.prisma.file.findUnique({ where: { id } });
    if (!data) throw new NotFoundException();

    if (data.password) {
      if (!pass) throw new BadRequestException();

      const isMatch = await bcrypt.compare(pass, data.password);
      if (!isMatch) throw new UnauthorizedException();
    }

    return {
      data: {
        data: data.id,
        createdAt: data.createdAt,
        path: data.path,
        message: data.message,
      },
    };
  }

  /*
   * NOTE: Download file
   *       ---
   *       @Param {string}  id
   *       @Param {?string} pass
   */
  async downloadFile(id: string, pass: string) {
    const data = await this.prisma.file.findUnique({ where: { id } });
    if (!data) throw new NotFoundException();

    if (data.password) {
      if (!pass) throw new BadRequestException();

      const isMatch = await bcrypt.compare(pass, data.password);
      if (!isMatch) throw new UnauthorizedException();
    }

    const file = createReadStream(join(process.cwd(), data.path));
    return new StreamableFile(file);
  }

  /*
   * NOTE: Upload file
   *       ---
   *       @Param    {Object}  body
   *       @Property {File}    object.file
   *       @Property {?string} object.password
   *       @Property {?string} object.message
   *       @Param    {File}    file
   *
   * FIX: Provide random password for deletion
   *      User created password ONLY for access!
   *
   * TODO: Allow user to specify:
   *        - max number of total downloads before deletion
   *        - availability duration(hours / days)
   */
  async uploadFile(body: any, file: Express.Multer.File) {
    let hash: string | null = null;
    if (body.password) {
      hash = await bcrypt.hash(body.password, 12);
    }

    const data = await this.prisma.file.create({
      data: {
        path: file.path,
        password: hash,
        message: body.message,
      },
      omit: { password: true },
    });
    if (!data) throw new ServiceUnavailableException();

    this.addCronJob(data.id, data.path.split('/')[1]);
    return data;
  }

  /*
   * NOTE: Delete file
   *       ---
   *       @Param {string}  id
   *       @Param {?string} pass
   */
  async deleteFile(id: string, pass: string) {
    const data = await this.prisma.file.delete({ where: { id } });
    if (!data) throw new NotFoundException();

    if (data.password) {
      if (!pass) throw new BadRequestException();

      const isMatch = await bcrypt.compare(pass, data.password);
      if (!isMatch) throw new UnauthorizedException();
    }

    if (existsSync(data.path)) {
      unlinkSync(data.path);
      return {
        id: data.id,
        createdAt: data.createdAt,
        path: data.path,
        message: data.message,
      };
    } else {
      // TODO: Don't throw exception as data was deleted
      throw new NotFoundException();
    }
  }

}
