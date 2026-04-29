export interface Workout {
    id: string;
    date: string;
    type: string;
    duration: number;
    calories: number;
    notes: string;
    status: 'Completed' | 'Missed';
}

export interface HealthMetric {
    id: string;
    date: string;
    weight: number;
    height: number;
    bmi: number;
    restingHeartRate: number;
    sleepHours: number;
}

export interface Goal {
    id: string;
    name: string;
    type: 'Giảm cân' | 'Tăng cơ' | 'Cải thiện sức bền' | 'Khác';
    targetValue: number;
    currentValue: number;
    deadline: string;
    status: 'Đang thực hiện' | 'Đã đạt' | 'Đã hủy';
}

export interface Exercise {
    id: string;
    name: string;
    muscleGroup: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';
    difficulty: 'Dễ' | 'Trung bình' | 'Khó';
    description: string;
    caloriesPerHour: number;
    instructions: string;
}