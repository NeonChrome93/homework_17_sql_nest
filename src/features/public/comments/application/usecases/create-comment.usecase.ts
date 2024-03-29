import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../../repositories/comment.repository';
import { CommentsViewType, REACTIONS_ENUM } from '../../api/models/output/comments.output.models';
import { randomUUID } from 'crypto';
import { CommentsDBType } from '../../domain/comment.entity';

export class CreateCommentCommand {
    constructor(
        public postId: string,
        public userId: string,
        public userLogin: string,
        public content: string,
    ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand> {
    constructor(private readonly commentRepository: CommentRepository) {}

    async execute(command: CreateCommentCommand): Promise<CommentsViewType> {
        const { postId, userId, userLogin, content } = command;
        const newComment: CommentsDBType = {
            id: randomUUID(),
            postId,
            content,
            commentatorInfo: {
                userId,
                userLogin,
            },
            createdAt: new Date(),
            reactions: [],
        };
        await this.commentRepository.createComment(newComment);
        return {
            id: newComment.id.toString(),
            content,
            commentatorInfo: newComment.commentatorInfo,
            createdAt: newComment.createdAt.toISOString(),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: REACTIONS_ENUM.None,
            },
        };
    }
}
