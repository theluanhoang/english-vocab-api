import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { Repository } from 'typeorm';
import { CollectionsService } from './collections.service';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { CreateCollectionDTO } from './dto/create-collection.dto';
import { GetCollectionDTO } from './dto';

@ApiBearerAuth()
@ApiTags('Collections')
@UseGuards(AuthGuard('jwt'))
@Controller('collections')
export class CollectionsController {
    constructor(
        private readonly collectionsService: CollectionsService
    ) { }

    @ApiOkResponse({
        description: 'Create a collection sucessfully!',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request.',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Post()
    async create(@CurrentUser() currUser: User, @Body() createCollectionDTO: CreateCollectionDTO): Promise<any> {
        return this.collectionsService.create(currUser.id, createCollectionDTO);
    }

    @ApiOkResponse({
        description: 'Get all of collection is sucess!',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request.',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiQuery({ name: 'collectionId', required: false, type: String, description: 'ID của bộ sưu tập (UUID)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
    @Get()
    async getAllCollection(@Query() query: GetCollectionDTO, @CurrentUser() currUser: User): Promise<Collection[]> {
        return this.collectionsService.getAllCollection(query, currUser.id);
    }
}
