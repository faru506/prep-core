import { useState } from "react";
import { Link } from "react-router-dom";

const programTopics = [
  {
    id: 1,
    name: "Strings",
    programs: [
      {
        id: 1,
        title: "Longest Substring Without Repeating Characters",
        description: "Find the length of the longest substring without repeating characters.",
        level: "Medium",
        duration: "1 day"
      },
      {
        id: 2,
        title: "Valid Palindrome",
        description: "Check if a string is a palindrome considering only alphanumeric characters.",
        level: "Easy",
        duration: "1 day"
      },
      {
        id: 3,
        title: "Reverse String",
        description: "Write a function that reverses a string in-place.",
        level: "Easy",
        duration: "1 day"
      },
      {
        id: 4,
        title: "String to Integer (atoi)",
        description: "Implement myAtoi function to convert string to integer.",
        level: "Medium",
        duration: "2 days"
      }
    ]
  },
  {
    id: 2,
    name: "Arrays",
    programs: [
      {
        id: 5,
        title: "Two Sum",
        description: "Find two numbers in an array that add up to a target.",
        level: "Easy",
        duration: "1 day"
      },
      {
        id: 6,
        title: "3D Array Operations",
        description: "Practice multi-dimensional array manipulations.",
        level: "Medium",
        duration: "2 days"
      },
      {
        id: 7,
        title: "Maximum Subarray",
        description: "Find the contiguous subarray with the largest sum.",
        level: "Medium",
        duration: "2 days"
      },
      {
        id: 8,
        title: "Rotate Array",
        description: "Rotate an array to the right by k steps.",
        level: "Medium",
        duration: "1 day"
      }
    ]
  },
  {
    id: 3,
    name: "Linked Lists",
    programs: [
      {
        id: 9,
        title: "Reverse Linked List",
        description: "Reverse a singly linked list.",
        level: "Easy",
        duration: "1 day"
      },
      {
        id: 10,
        title: "Merge Two Sorted Lists",
        description: "Merge two sorted linked lists into one sorted list.",
        level: "Easy",
        duration: "1 day"
      },
      {
        id: 11,
        title: "Linked List Cycle",
        description: "Detect if a linked list has a cycle.",
        level: "Medium",
        duration: "2 days"
      }
    ]
  },
  {
    id: 4,
    name: "Stacks",
    programs: [
      {
        id: 12,
        title: "Valid Parentheses",
        description: "Check if brackets are balanced in a string.",
        level: "Easy",
        duration: "1 day"
      },
      {
        id: 13,
        title: "Min Stack",
        description: "Design a stack that supports push, pop, top, and getMin.",
        level: "Medium",
        duration: "2 days"
      },
      {
        id: 14,
        title: "Stack using Queue",
        description: "Implement stack using queue data structures.",
        level: "Hard",
        duration: "3 days"
      }
    ]
  },
  {
    id: 5,
    name: "Queues",
    programs: [
      {
        id: 15,
        title: "Implement Stack using Queues",
        description: "Use queues to implement stack operations.",
        level: "Medium",
        duration: "2 days"
      },
      {
        id: 16,
        title: "Circular Queue",
        description: "Design a circular queue with fixed array size.",
        level: "Medium",
        duration: "2 days"
      }
    ]
  },
  {
    id: 6,
    name: "Trees",
    programs: [
      {
        id: 17,
        title: "Inorder Traversal",
        description: "Perform inorder traversal of a binary tree.",
        level: "Easy",
        duration: "1 day"
      },
      {
        id: 18,
        title: "Maximum Depth of Binary Tree",
        description: "Find the maximum depth of a binary tree.",
        level: "Easy",
        duration: "1 day"
      },
      {
        id: 19,
        title: "Validate BST",
        description: "Check if a binary tree is a valid binary search tree.",
        level: "Medium",
        duration: "2 days"
      }
    ]
  },
  {
    id: 7,
    name: "Graphs",
    programs: [
      {
        id: 20,
        title: "Number of Islands",
        description: "Count the number of islands in a 2D grid.",
        level: "Medium",
        duration: "2 days"
      },
      {
        id: 21,
        title: "Clone Graph",
        description: "Deep copy a graph with random pointers.",
        level: "Medium",
        duration: "3 days"
      }
    ]
  },
  {
    id: 8,
    name: "Dynamic Programming",
    programs: [
      {
        id: 22,
        title: "Climbing Stairs",
        description: "Count ways to climb n stairs with 1 or 2 steps.",
        level: "Easy",
        duration: "1 day"
      },
      {
        id: 23,
        title: "Coin Change",
        description: "Find minimum coins to make a given amount.",
        level: "Medium",
        duration: "2 days"
      },
      {
        id: 24,
        title: "Longest Increasing Subsequence",
        description: "Find the length of the longest increasing subsequence.",
        level: "Medium",
        duration: "2 days"
      }
    ]
  }
];

const Programs = () => {
  const [expandedTopic, setExpandedTopic] = useState(1);

  const toggleTopic = (id) => {
    setExpandedTopic(expandedTopic === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-950 to-cyan-900/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Training Programs
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Master data structures and algorithms with structured practice.
            </p>
          </div>

          <div className="space-y-3">
            {programTopics.map((topic) => (
              <div 
                key={topic.id}
                className="rounded-xl bg-slate-900/50 border border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-slate-100">
                      {topic.name}
                    </span>
                    <span className="text-sm text-slate-500">
                      ({topic.programs.length} programs)
                    </span>
                  </div>
                  <svg 
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${expandedTopic === topic.id ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedTopic === topic.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-4 md:p-6 border-t border-slate-800 flex flex-col gap-3">
                    {topic.programs.map((program) => (
                      <div 
                        key={program.id}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all duration-300"
                      >
                        <div className="mb-3 sm:mb-0">
                          <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
                            {program.title}
                          </h3>
                          <p className="text-sm text-slate-400 mt-1">
                            {program.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-lg bg-slate-700/50 text-slate-300 text-xs">
                              {program.level}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-lg bg-slate-700/50 text-slate-300 text-xs">
                              {program.duration}
                            </span>
                          </div>
                          
                          <Link 
                            to="/interview_qa" 
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                          >
                            Start
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>

    </div>
  );
};

export default Programs;