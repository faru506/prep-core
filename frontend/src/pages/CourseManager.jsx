import { useEffect, useState } from "react";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { reorderCoursesApi, fetchAdminCourses, fetchAdminTopics } from "../apis/course_manager";
import CreateCourseModal from "../components/Modal/CreateCourseModal";
import CreateTopicModal from "../components/Modal/CreateTopicModal";
import ConfirmDialog from "../components/Modal/ConfirmDialog";
import SortableCourse from "../components/Sortable/SortableCourse";

const CourseManager = () => {

  const [courses, setCourses] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [pendingCourseReorder, setPendingCourseReorder] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const res = await fetchAdminCourses();
    const data = await res.json();
    setCourses(data);

    // Load topics for all courses to enable search functionality
    await Promise.all(
      data.map(async (course) => {
        const topicRes = await fetchAdminTopics(course.id);
        const topics = await topicRes.json();
        setCourses((prev) =>
          prev.map((c) =>
            c.id === course.id ? { ...c, topics } : c
          )
        );
      })
    );
  };

  const loadTopics = async (courseId) => {
    const res = await fetchAdminTopics(courseId);
    const topics = await res.json();

    setCourses(prev =>
      prev.map(course =>
        course.id === courseId
          ? {
              ...course,
              topics
            }
          : course
      )
    );

  };

  const toggleCourse = async (courseId) => {

      setExpanded(prev => ({
        ...prev,
        [courseId]:
          !prev[courseId]
      }));

      const course =
        courses.find(
          c => c.id === courseId
        );

      if (!course.topics) {
        await loadTopics(courseId);
      }

    };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex =
      courses.findIndex(
        c => c.id === active.id
      );

    const newIndex =
      courses.findIndex(
        c => c.id === over.id
      );

    const nextCourses = [...courses];

    const [moved] =
      nextCourses.splice(
        oldIndex,
        1
      );

    nextCourses.splice(
      newIndex,
      0,
      moved
    );

    setCourses(nextCourses);
    setPendingCourseReorder({
      movedCourseTitle: moved.title,
      oldPosition: oldIndex + 1,
      newPosition: newIndex + 1,
      previousCourses: courses,
      nextCourses
    });
  };

  return (

    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl">
          Course Manager
        </h1>

        <div className="flex items-center gap-4 flex-1 justify-end">
          <input
            type="text"
            placeholder="Search courses or topics..."
            className="bg-slate-800 border border-slate-700 px-4 py-2 rounded text-white w-full max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button
            onClick={() =>
              setShowCourseModal(true)
            }
            className="bg-indigo-600 px-4 py-2 rounded whitespace-nowrap"
          >
            + Create Course
          </button>
        </div>
      </div>

      <DndContext
        collisionDetection={
          closestCenter
        }
        onDragEnd={
          handleDragEnd
        }
      >

        <SortableContext
          items={
            courses
              .filter(course => {
                if (searchQuery.length < 3) return true;
                const query = searchQuery.toLowerCase();
                const courseMatches = course.title.toLowerCase().includes(query);
                const topicsMatch = course.topics?.some(t => t.title.toLowerCase().includes(query));
                return courseMatches || topicsMatch;
              })
              .map(
                c => c.id
              )
          }
          strategy={
            verticalListSortingStrategy
          }
        >

          <div className="space-y-2">

            {courses
              .filter(course => {
                if (searchQuery.length < 3) return true;
                const query = searchQuery.toLowerCase();
                const courseMatches = course.title.toLowerCase().includes(query);
                const topicsMatch = course.topics?.some(t => t.title.toLowerCase().includes(query));
                return courseMatches || topicsMatch;
              })
              .map(course => (

                <SortableCourse
                  key={course.id}
                  course={course}
                  expanded={expanded}
                  toggleCourse={toggleCourse}
                  setSelectedCourse={setSelectedCourse}
                  setShowTopicModal={setShowTopicModal}
                  setCourses={setCourses}
                  expandedTopics={expandedTopics}
                  setExpandedTopics={setExpandedTopics}
                  searchQuery={searchQuery}
                />

              ))}

          </div>

        </SortableContext>

      </DndContext>

      {showCourseModal && (

        <CreateCourseModal
          onClose={() =>
            setShowCourseModal(false)
          }
          onCreated={loadCourses}
        />

      )}

      {showTopicModal &&
        selectedCourse && (

        <CreateTopicModal
          course={selectedCourse}
          onClose={() =>
            setShowTopicModal(false)
          }
          onCreated={() =>
            loadTopics(
              selectedCourse.id
            )
          }
        />

      )}

      {pendingCourseReorder && (

        <ConfirmDialog
          title="Save new course order?"
          description={`"${pendingCourseReorder.movedCourseTitle}" moved from position ${pendingCourseReorder.oldPosition} to ${pendingCourseReorder.newPosition}. Save this course order to the database?`}
          tone="primary"
          confirmLabel="Save order"
          onCancel={() => {
            setCourses(
              pendingCourseReorder.previousCourses
            );
            setPendingCourseReorder(null);
          }}
          onConfirm={async () => {
            await reorderCoursesApi(
              pendingCourseReorder.nextCourses.map(
                c => c.id
              )
            );
            setPendingCourseReorder(null);
          }}
        />

      )}

    </div>

  );

};

export default CourseManager;
