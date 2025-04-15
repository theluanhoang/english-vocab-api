import { Collection } from "src/modules/collections/entities/collection.entity";
import { CommonEntity } from "src/shared/entities/common.entity";
import { Role } from "src/shared/enum";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('users')
export class User extends CommonEntity {
    @Column({ nullable: true, select: false })
    password: string;

    @Column({ nullable: true })
    email: string;

    @Column({ type: 'enum', enum: Role, default: Role.User })
    role: Role;

    @Column({ default: 0 })
    tokenVersion: number;

    @OneToMany(() => Collection, (collection) => collection.user)
    collections: Collection[];
}