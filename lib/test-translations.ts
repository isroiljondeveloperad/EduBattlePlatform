export interface TestTranslation {
  title: string
  description: string
  question: string
  options: {
    a: string
    b: string
    c: string
    d: string
  }
}

export function getTestTranslation(test: any, language: "en" | "uz"): { title: string; description: string } {
  if (language === "uz" && test.title_uz) {
    return {
      title: test.title_uz,
      description: test.description_uz || test.description,
    }
  }
  return {
    title: test.title,
    description: test.description,
  }
}

export function getQuestionTranslation(
  question: any,
  language: "en" | "uz",
): {
  question: string
  options: { a: string; b: string; c: string; d: string }
} {
  if (language === "uz" && question.question_uz) {
    return {
      question: question.question_uz,
      options: {
        a: question.option_a_uz || question.option_a,
        b: question.option_b_uz || question.option_b,
        c: question.option_c_uz || question.option_c,
        d: question.option_d_uz || question.option_d,
      },
    }
  }
  return {
    question: question.question,
    options: {
      a: question.option_a,
      b: question.option_b,
      c: question.option_c,
      d: question.option_d,
    },
  }
}
