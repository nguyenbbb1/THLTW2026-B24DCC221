export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
	id: string;
	title: string;
	description: string;
	deadline?: string | null;
	priority: TaskPriority;
	tags: string[];
	status: TaskStatus;
}
