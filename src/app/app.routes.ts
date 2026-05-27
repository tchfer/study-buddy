import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
	{
		path: 'dashboard',
		title: 'Dashboard',
		loadComponent: () => import('./features/dashboard/dashboard.page').then((m) => m.DashboardPage),
	},
	{
		path: 'courses',
		title: 'Course Catalog',
		loadComponent: () => import('./features/courses/courses.page').then((m) => m.CoursesPage),
	},
	{
		path: 'quiz',
		title: 'Quiz',
		loadComponent: () => import('./features/quiz/quiz.page').then((m) => m.QuizPage),
	},
	{
		path: 'analytics',
		title: 'Analytics',
		loadComponent: () => import('./features/analytics/analytics.page').then((m) => m.AnalyticsPage),
	},
	{
		path: 'profile',
		title: 'Profile',
		loadComponent: () => import('./features/profile/profile.page').then((m) => m.ProfilePage),
	},
	{ path: '**', redirectTo: 'dashboard' },
];
