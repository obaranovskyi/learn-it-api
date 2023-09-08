-- Drop all connections to specific database without stopping the server
-- Took from -> https://dba.stackexchange.com/questions/16426/how-to-drop-all-connections-to-a-specific-database-without-stopping-the-server
select pg_terminate_backend(pid) from pg_stat_activity where datname='pd_dev';

-- Drop database
drop database pd_dev;

-- Create necessary database
create database "pd_dev";

-- Select share workspace
select 
	share_workspace.id as share_workspace_id,
	share_workspace.created as share_workspace_created,
	share_workspace.updated as share_workspace_updated,
	share_workspace.roles,
	share_workspace."userId" as share_workspace_user_id,
	share_workspace."workspaceId" as workspace_id,
	workspace.name as workspace_name,
	workspace.created as workspace_created,
	workspace.updated as workspace_updated,
	workspace."ownerId" as workspace_owner_id
from share_workspace
left join workspace on workspace.id = share_workspace."workspaceId";

select "workspaceId" from share_workspace;
select * from "user";

