import { REACTIONS_ENUM } from '../api/models/output/comments.output.models';

export type CommentsDBType = {
    id: string;
    postId: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: Date;
    reactions: StatusType[];
};

export type StatusType = {
    userId: string;
    createdAt: Date;
    status: REACTIONS_ENUM;
};
