export interface ICosts {
	food: number;
	accommodation: number;
	transport: number;
}

export interface IDestination {
	id: string;
	name: string;
	type: 'sea' | 'mountain' | 'city' | 'cave';
	price: number;
	rating: number;
	image: string;
	description: string;
	visitTime: number; // Thời gian tham quan (giờ)
	costs: ICosts;
}

export interface IItineraryItem {
	id: string; // ID duy nhất cho mỗi mục trong lịch trình
	day: number;
	destination: IDestination;
}

export interface IBudgetConfig {
	maxBudget: number;
}

export interface IAppContext {
	destinations: IDestination[];
	setDestinations: React.Dispatch<React.SetStateAction<IDestination[]>>;
	itinerary: IItineraryItem[];
	setItinerary: React.Dispatch<React.SetStateAction<IItineraryItem[]>>;
	budgetConfig: IBudgetConfig;
	setBudgetConfig: React.Dispatch<React.SetStateAction<IBudgetConfig>>;
}
