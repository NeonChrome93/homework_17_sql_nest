// @Controller('comments')
//
// export class CommentController {
//     constructor(
//         private readonly commentsQueryRepository: CommentsQueryRepository,
//         private readonly commandBus: CommandBus
//     ) {
//     }
//
//     @Get(':commentId')
//     @UseGuards(SoftBearerAuthGuard)
//     async getCommentById(@Param('commentId') commentId: string, @UserId() userId: string | null) {
//
//         let foundId = await this.commentsQueryRepository.readCommentId(commentId, userId)
//         if (!foundId) {
//             throw new NotFoundException('Comment with id not found')
//         } else return foundId
//
//     }
//
//     @Put(':commentId')
//     @HttpCode(204)
//     @UseGuards(CommentOwnerGuard)
//      @UseGuards(BearerAuthGuard)
//     async updateCommentById(@Param('commentId') commentId: string, @Body() commentDto: UpdateCommentDto) {
//         console.log(22222)
//
//         let foundId = await this.commandBus.execute(new UpdateCommentCommand(commentId, commentDto))
//         if (!foundId) {
//           throw new NotFoundException('Comment with id not found');
//         } else return foundId
//
//     }
//
//     @Put(':commentId/like-status')
//     @HttpCode(204)
//     @UseGuards(BearerAuthGuard)
//     async updateLikeStatus(@Param('commentId') commentId: string, @Body() dto:  updateLikeDto, @UserId() userId: string) {
//         // console.log(status, "likestatus")
//         // console.log(await CommentModel.findOne({_id: new ObjectId(comment)}))
//         let addLikes = await this.commandBus.execute(new AddReactionCommand(commentId, userId, dto.likeStatus));
//         // console.log(await CommentModel.findOne({_id: new ObjectId(comment)}))
//         if (addLikes) {
//             return addLikes;
//         } else throw new NotFoundException('Comment with id not found');
//
//     }
//
// //1) добавить лайк в сервисе 2)добавить сохранение в БД  обновленной БД модели 3) получение по статусу
//     @Delete(':commentId')
//     @HttpCode(204)
//     @UseGuards(CommentOwnerGuard)
//     @UseGuards(BearerAuthGuard)
//     async deleteCommentById(@Param('commentId') commentId: string) {
//         let isDeleted = await this.commandBus.execute(new DeleteCommentCommand(commentId))
//         if (isDeleted) {
//             return isDeleted;
//         } else throw new NotFoundException('Comment with id not found');
//     }
// }
