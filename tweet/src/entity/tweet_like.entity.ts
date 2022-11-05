import { CreateDateColumn, JoinColumn, OneToOne, PrimaryColumn, Unique } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";
import { Tweet } from "./tweet.entity";

@Entity()
@Unique(['user_id', 'tweet_id'])
export class TweetLike{
    
    @PrimaryColumn()
    user_id: number;

    @PrimaryColumn()
    tweet_id: string;

    @OneToOne(()=>Tweet)
    @JoinColumn({name:'tweet_id'})
    tweet: Tweet;
    
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

}