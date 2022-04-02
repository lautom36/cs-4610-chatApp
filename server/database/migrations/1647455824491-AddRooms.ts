import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class AddRooms1647455824491 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'chat_room',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'name',
            type: 'text',
          },
          {
            name: 'roomkey',
            type: 'text',
            isUnique: true,
          },
          {
            name: 'lat',
            type: 'float',
          },
          {
            name: 'lon',
            type: 'float',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('chat_room');
  }
}
