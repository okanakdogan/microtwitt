import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    username: string

    @Column()
    displayName: string;

    @Column({unique:true})
    email: string;

    @Column()
    password_hash: string;

    @Column({ type: "timestamp", nullable:true})
    lastLogin: Date;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

}