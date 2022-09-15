import { SocioDto } from 'src/socio.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { SocioEntity } from 'src/socio/socio.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { SocioClubService } from './socio-club.service';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioClubController {
  constructor(private readonly socioClubService: SocioClubService) {}

  @Post(':idClub/socios/:idSocio')
  async addMemberToClub(
    @Param('idClub') idClub: string,
    @Param('idSocio') idSocio: string,
  ) {
    return await this.socioClubService.addMemberToClub(idClub, idSocio);
  }

  @Put(':idClub/socios')
  async associateSocioClub(
    @Body() socioDto: SocioDto[],
    @Param('idClub') idClub: string,
  ) {
    const socios: SocioEntity[] = plainToClass(SocioEntity, socioDto);
    return await this.socioClubService.updateMembersFromClub(idClub, socios);
  }

  @Get(':idClub/socios/:idSocio')
  async findMemberFromClub(
    @Param('idClub') idClub: string,
    @Param('idSocio') idSocio: string,
  ) {
    return await this.socioClubService.findMemberFromClub(idClub, idSocio);
  }

  @Get(':idClub/socios')
  async findMembersFromClub(@Param('idClub') idClub: string) {
    return await this.socioClubService.findMembersFromClub(idClub);
  }

  @Delete(':idClub/socios/:idSocio')
  @HttpCode(204)
  async deleteMemberFromClub(
    @Param('idClub') idClub: string,
    @Param('idSocio') idSocio: string,
  ) {
    return await this.socioClubService.deleteMemberFromClub(idClub, idSocio);
  }
}
