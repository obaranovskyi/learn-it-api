import { Entity, UpdateDateColumn, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';

import { WorkspaceEntity } from './workspace.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { ShareWorkspaceRolesEnum } from '../enum/share-workspace-roles.enum';
import { ShareWorkspaceResponseModel } from '../model/share-workspace-response.model';

@ObjectType()
@Entity('share_workspaces')
export class ShareWorkspaceEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => GraphQLISODateTime)
    @CreateDateColumn()
    created: Date;

    @Field(() => GraphQLISODateTime)
    @UpdateDateColumn()
    updated: Date;

    @Field(() => WorkspaceEntity)
    @ManyToOne(() => WorkspaceEntity, (workspace: WorkspaceEntity) => workspace.sharedWorkspaces, { eager: true, onDelete: 'CASCADE' })
    workspace: WorkspaceEntity;

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user: UserEntity) => user.sharedWorkspaces, { eager: true, onDelete: 'CASCADE' })
    user: UserEntity;

    @Field(() => [ShareWorkspaceRolesEnum])
    @Column({
        type: 'enum',
        enum: ShareWorkspaceRolesEnum,
        array: true,
        default: [ShareWorkspaceRolesEnum.CAN_VIEW],
    })
    roles: ShareWorkspaceRolesEnum[];

    toResponseObject(): ShareWorkspaceResponseModel {
        const owner = this.workspace.owner;
        const workspaceResponseObject = this.workspace.toResponseObject();
        Reflect.deleteProperty(workspaceResponseObject, 'ownerId');
        Reflect.deleteProperty(workspaceResponseObject, 'ownerName');

        return {
            id: this.id,
            created: this.created,
            updated: this.updated,
            workspace: workspaceResponseObject,
            userId: this.user.id,
            username: this.user.username,
            roles: this.roles,
            ownerId: owner.id,
            ownerName: owner.username,
        };
    }

    canBeRemovedBy(userId: number): boolean {
        const owner = this.workspace.owner;

        return userId === this.user.id || userId === owner.id;
    }

    isOwner(userId: number): boolean {
        return this.workspace.isOwner(userId);
    }
}
