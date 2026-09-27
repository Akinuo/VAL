import type { Content, Quiz } from './content'
import { isLessonFull } from './lessons'

// Score needed (as a percentage) to pass the final assessment and earn the
// certificate. Adjust here if the program wants a stricter/looser bar.
export const PASS_PERCENT = 80

export type AssessmentQuestion = Quiz & { lessonTitle: string }

// The final assessment doesn't need its own bank of content to maintain —
// every lesson step already carries one quiz question, so pulling all of
// them together gives a comprehensive exam (currently 8 lessons × 5
// questions = 40, well past the 20-question minimum) that stays in sync
// with whatever's edited in the Supabase content tables automatically.
export function buildAssessmentQuestions(c: Content): AssessmentQuestion[] {
  return c.lessons.flatMap(l =>
    l.steps
      .filter((s): s is typeof s & { quiz_questions: [Quiz, ...Quiz[]] } => !!s.quiz_questions?.[0])
      .map(s => ({ ...s.quiz_questions[0], lessonTitle: l.title }))
  )
}

// The assessment only unlocks once every lesson is fully completed —
// mirrors the same "every step passed" rule lessons.ts uses to unlock the
// next lesson, just applied to the whole course at once.
export function isAssessmentUnlocked(c: Content, done: Set<string>): boolean {
  return c.lessons.length > 0 && c.lessons.every(l => isLessonFull(l, done))
}

export function isPassingScore(score: number, total: number): boolean {
  return total > 0 && Math.round((score / total) * 100) >= PASS_PERCENT
}
