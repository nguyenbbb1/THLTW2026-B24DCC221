import { Workout, HealthMetric, Goal, Exercise } from './types';
import moment from 'moment';

export const mockWorkouts: Workout[] = [
    { id: '1', date: moment().subtract(1, 'days').format('YYYY-MM-DD'), type: 'Cardio', duration: 30, calories: 300, notes: 'Chạy bộ công viên', status: 'Completed' },
    { id: '2', date: moment().subtract(2, 'days').format('YYYY-MM-DD'), type: 'Strength', duration: 45, calories: 400, notes: 'Đẩy ngực', status: 'Completed' },
    { id: '3', date: moment().subtract(3, 'days').format('YYYY-MM-DD'), type: 'Yoga', duration: 60, calories: 200, notes: 'Giãn cơ', status: 'Completed' },
    { id: '4', date: moment().subtract(4, 'days').format('YYYY-MM-DD'), type: 'HIIT', duration: 20, calories: 350, notes: 'Tập cường độ cao', status: 'Completed' },
    { id: '5', date: moment().subtract(5, 'days').format('YYYY-MM-DD'), type: 'Cardio', duration: 40, calories: 400, notes: 'Bỏ lỡ do mưa', status: 'Missed' },
];

export const mockHealthMetrics: HealthMetric[] = [
    { id: '1', date: moment().subtract(7, 'days').format('YYYY-MM-DD'), weight: 70, height: 175, bmi: 22.86, restingHeartRate: 65, sleepHours: 7.5 },
    { id: '2', date: moment().subtract(3, 'days').format('YYYY-MM-DD'), weight: 69.5, height: 175, bmi: 22.69, restingHeartRate: 63, sleepHours: 8 },
    { id: '3', date: moment().format('YYYY-MM-DD'), weight: 69, height: 175, bmi: 22.53, restingHeartRate: 62, sleepHours: 7 },
];

export const mockGoals: Goal[] = [
    { id: '1', name: 'Giảm 5kg', type: 'Giảm cân', targetValue: 65, currentValue: 69, deadline: moment().add(30, 'days').format('YYYY-MM-DD'), status: 'Đang thực hiện' },
    { id: '2', name: 'Chạy 10km liên tục', type: 'Cải thiện sức bền', targetValue: 10, currentValue: 5, deadline: moment().add(15, 'days').format('YYYY-MM-DD'), status: 'Đang thực hiện' },
];

export const mockExercises: Exercise[] = [
    { id: '1', name: 'Push Up', muscleGroup: 'Chest', difficulty: 'Dễ', description: 'Chống đẩy cơ bản', caloriesPerHour: 400, instructions: '1. Nằm sấp. 2. Đẩy người lên. 3. Hạ xuống.' },
    { id: '2', name: 'Squat', muscleGroup: 'Legs', difficulty: 'Trung bình', description: 'Tập đùi và mông', caloriesPerHour: 500, instructions: '1. Đứng rộng bằng vai. 2. Hạ hông xuống. 3. Đứng lên.' },
    { id: '3', name: 'Plank', muscleGroup: 'Core', difficulty: 'Trung bình', description: 'Giữ cơ bụng', caloriesPerHour: 300, instructions: '1. Tựa bằng khuỷu tay. 2. Giữ thân thẳng. 3. Gồng bụng.' },
    { id: '4', name: 'Pull Up', muscleGroup: 'Back', difficulty: 'Khó', description: 'Kéo xà đơn', caloriesPerHour: 600, instructions: '1. Nắm xà. 2. Kéo người lên qua cằm. 3. Từ từ hạ xuống.' },
];