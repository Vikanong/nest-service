import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { formatTime } from '../utils/index';

@Injectable()
export class UserService {

    private lastAddTime: number;

    constructor(
        // 注入实数据库实体
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        this.lastAddTime = 0
    }

    async findAll() {
        const res = await this.userRepository.find();
        const _res = res.map(item => {
            return {
                id: item.id,
                user: item.user,
                create_time: formatTime(item.create_time),
            }
        })
        return _res
    }

    async update(updateUserDto: UpdateUserDto) {
        const { id } = updateUserDto;
        const res = await this.userRepository.update(id, updateUserDto)
        return null
    }

    async delete(id: string) {
        const res = await this.userRepository.delete(id)
        return null
    }

    async add(createUserDto: CreateUserDto) {
        const currentTime = Date.now();
        if (currentTime - this.lastAddTime < 3000) {
            throw new ConflictException('You must wait at least 3 seconds before adding another user.');
        }
        const param = {
            user: createUserDto.user,
            create_time: new Date(),
        };
        const res = await this.userRepository.save(param);
        this.lastAddTime = currentTime;
        return res
    }
}
