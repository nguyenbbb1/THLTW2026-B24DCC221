export interface Club {
	id: string;
	avatar: string; // Emoji hoặc URL
	name: string;
	foundedDate: string;
	description: string;
	leader: string;
	isActive: boolean;
}

export type AppStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Application {
	id: string;
	fullName: string;
	email: string;
	phone: string;
	gender: 'Nam' | 'Nữ' | 'Khác';
	address: string;
	strengths: string;
	clubId: string;
	reason: string;
	status: AppStatus;
	note?: string;
}

export interface HistoryLog {
	id: string;
	action: string;
	timestamp: string;
	details: string;
}
