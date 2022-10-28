import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string

    @Column()
    displayName: string;

    @Column()
    email: string;

    @Column()
    password_hash: string;

    @Column({ type: "timestamp" })
    lastLogin: Date;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

}