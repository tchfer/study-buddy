export type CourseSubject = 'Math' | 'Science' | 'ELA';

export type CourseLevel = 'High School' | 'College Prep';

export type Course = {
  id: string;
  title: string;
  subject: CourseSubject;
  level: CourseLevel;
  description: string;
  tags: string[];
  coverImageUrl: string;
  lessonIds: string[];
  quizIds: string[];
  updatedAt: string;
};
