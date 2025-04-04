import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { NoteWordDTO } from './dto/note-word.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Collection } from '../collections/entities/collection.entity';

@ApiBearerAuth()
@ApiTags('Vocabularies')
@UseGuards(AuthGuard('jwt'))
@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}
  
  @ApiOkResponse({
    description: 'Get all lobby successfully',
    type: Collection,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @ApiOperation({ summary: 'Enter a word then receive a collection that contains variants of word' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('add-with-variants')
  async addWordWithVariants(
    @Request() req,
    @Body() body: NoteWordDTO,
  ): Promise<string[]> {
    const userId = req.user.id;
    const { word } = body;

    return this.vocabularyService.noteWord(
      userId,
      word,
    );
  }
}