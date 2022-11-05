import { Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";

@Entity()
export class Tweet{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    text: string;

    @Column({default: 0})
    like_count: number;
    
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @Column() //one-to-one relation for user
    user_id: number;
}