import { BadRequestException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { EMessageError } from 'src/shared/common/error.message';
import { FindOneOptions, Repository } from 'typeorm';
import { LoginDTO } from '../auth/dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/create-user.dto';
import { UNPROCESSABLE_ENTITY } from 'src/shared/common';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async isEmailAvailable(
        email: string,
        userId: string,
    ): Promise<boolean> {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (user && user.id !== userId) {
            throw new BadRequestException(EMessageError.EMAIL_IS_EXISTS);
        }

        return true;
    }

    async getOne(options: FindOneOptions<User>): Promise<User | null> {
        return this.userRepository.findOne(options);
    }

    async getOneOrThrow(options: FindOneOptions<User>): Promise<User> {
        const user = await this.userRepository.findOne(options);

        if (!user) {
            throw new BadRequestException(EMessageError.USER_NOT_FOUND);
        }

        return user;
    }

    async comparePassword(dto: LoginDTO): Promise<User> {
        try {
            const user = await this.userRepository
                .createQueryBuilder('u')
                .where('email = :email', { email: dto.email })
                .addSelect('u.password')
                .getOne();

            if (!user || user.deletedAt) {
                throw new UnauthorizedException(EMessageError.INVALID_CREDENTIALS);
            }

            const isMatch = await bcrypt.compare(dto.password, user.password);
            
            if (!isMatch) {
                throw new UnauthorizedException(EMessageError.INVALID_CREDENTIALS);
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    async create(createUserDTO: CreateUserDTO): Promise<User> {
        return this.userRepository.save(createUserDTO);
    }

}
