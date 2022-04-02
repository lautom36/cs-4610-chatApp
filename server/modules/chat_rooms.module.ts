import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomsController } from 'server/controllers/chat_rooms.controller';
import { ChatRoom } from 'server/entities/chat_room.entity';
import { MessagesGateway } from 'server/providers/gateways/messages.gateway';
import { ChatRoomsService } from 'server/providers/services/chat_rooms.service';
import { JwtService } from 'server/providers/services/jwt.service';
import { GuardUtil } from 'server/providers/util/guard.util';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom,])],
  controllers: [ChatRoomsController],
  providers: [MessagesGateway, ChatRoomsService, JwtService, GuardUtil],
  exports: [],
})
export class ChatRoomsModule {}
