import { Controller, Post, Body, Request, UseGuards, Get, Param } from '@nestjs/common';
import { VocabularyService } from './vocabularies.service';
import { NoteWordDTO } from './dto/note-word.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';
import { Vocabulary } from './entities/vocabulary.entity';
import { WordCollection, WordDetails } from '../gemini/gemini.interface';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@ApiBearerAuth()
@ApiTags('Vocabularies')
@UseGuards(AuthGuard('jwt'))
@Controller('vocabulary')
export class VocabularyController {
    constructor(private readonly vocabularyService: VocabularyService) { }

    @ApiOkResponse({
        description: 'Get information of word from dictionary',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request.',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Post('')
    async getInformationOfWord(@Param('word') word: string): Promise<WordCollection> {

        return this.vocabularyService.getVariants(
            word
        );
    }

    @ApiOkResponse({
        description: 'Get information of word from dictionary',
    })
    @ApiBadRequestResponse({
        description: 'Bad Request.',
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Post('/note-word')
    async test(@Body() dto: NoteWordDTO, @CurrentUser() user: User): Promise<WordDetails & Vocabulary[]> {

        return this.vocabularyService.noteWord(
            dto,
            user.id
        );
    }
}