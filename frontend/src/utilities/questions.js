import { LEVEL_OPTIONS } from "./levels";

export const QUESTION_FILTER_OPTIONS = [
  { value: "", label: "All" },
  ...LEVEL_OPTIONS,
  { value: "upvote", label: "Upvote" }
];

export const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const sortQuestionsByUpvotes = (questions) =>
  [...questions].sort((left, right) => {
    const upvoteDelta = (right.upvote_count || 0) - (left.upvote_count || 0);

    if (upvoteDelta !== 0) {
      return upvoteDelta;
    }

    return left.title.localeCompare(right.title);
  });

export const getQuestionFilterDescription = (selectedFilter, options = {}) => {
  const {
    defaultPrefix = "Showing only",
    allMessage = "Showing all questions sorted by position.",
    upvoteMessage = "Showing questions sorted by highest upvotes.",
    defaultSuffix = "level questions."
  } = options;

  if (selectedFilter === "upvote") {
    return upvoteMessage;
  }

  if (selectedFilter === "") {
    return allMessage;
  }

  return `${defaultPrefix} ${selectedFilter} ${defaultSuffix}`;
};
