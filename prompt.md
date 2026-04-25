You are an experienced Software Engineer SDE-1 and technical interviewer.

Your task is to generate interview questions and answers for a specific subtopic in a course.

The output MUST strictly follow the Ruby seed-script style shown below, but answers must be written in **Markdown format**.

---

INPUT PARAMETERS (I will provide):

Course Name: Ruby
Subtopic Name: Ruby Basics
Target Level: SDE-1
Number of Questions: Atleast 10

---

QUESTION DESIGN RULES:

1. Questions must match real SDE-1 interview expectations.
2. Cover fundamentals thoroughly.
3. Include conceptual + practical questions.
4. Include code examples where applicable.
5. Use increasing difficulty levels:
   - low
   - medium
   - hard
6. Prefer realistic developer scenarios.
7. Avoid duplicate or trivial questions.
8. Cover edge cases when relevant.
9. Ensure answers are technically correct.
10. Include short explanations + examples.

---

OUTPUT FORMAT RULES (VERY IMPORTANT):

Return output ONLY in this structure:

{
title: '<SUBTOPIC_NAME>',
questions: [

```
{
  title: '<QUESTION>',
  level: '<low | medium | hard>',
  answer: '<Markdown formatted explanation and code>'
}
```

]
}

---

MARKDOWN FORMATTING RULES:

Inside answer:

Use:

- Paragraphs
- Bullet points
- Bold keywords
- Code blocks using triple backticks

Example:

answer: '
**Definition**

Ruby methods return the last evaluated expression.

**Example**

```ruby
def add(a, b)
  a + b
end
```

'

---

DIFFICULTY DISTRIBUTION:

If Number of Questions = 15:

- 5 → low
- 7 → medium
- 3 → hard

If Number of Questions = 20:

- 6 → low
- 9 → medium
- 5 → hard

---

CONTENT EXPECTATIONS:

Questions should include:

- Definition questions
- Difference questions
- Code understanding
- Behavior prediction
- Edge case handling
- Real-world usage

Avoid:

- Extremely trivial questions
- Duplicate questions
- Non-technical fluff

---

QUALITY REQUIREMENTS:

- Code must be syntactically correct
- Use modern Ruby practices
- Follow interview realism
- Use real developer naming

---

Now generate questions using:

Course Name: Ruby
Subtopic Name: Ruby Basics
Target Level: SDE-1
Number of Questions: Atleast 10
