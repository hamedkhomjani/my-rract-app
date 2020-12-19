import { useState, useEffect, useReducer } from 'react';
import CoursesList from './CoursesList';
import Search from './search';


const courses_data = [
  {
    id: 1,
    title: "Modern React",
    author: "Max Schwar",
    hours_video: 40.5,
    number_of_lectures: 490,
    rating: 4.6,
    url: "https://fa.wikipedia.org/wiki/%D8%B5%D9%81%D8%AD%D9%87%D9%94_%D8%A7%D8%B5%D9%84%DB%8C",
  },
  {
    id: 2,
    title: "React Dom",
    author: "Hamed Khomjani",
    hours_video: 50,
    number_of_lectures: 488,
    rating: 4.9,
    url: "https://fa.wikipedia.org/wiki/%D8%B5%D9%81%D8%AD%D9%87%D9%94_%D8%A7%D8%B5%D9%84%DB%8C",
  },
  {
    id: 3,
    title: "Hooks & Redux",
    author: "Maximilian Schwapenhouer",
    hours_video: 60,
    number_of_lectures: 300,
    rating: 4.3,
    url: "https://fa.wikipedia.org/wiki/%D8%B5%D9%81%D8%AD%D9%87%D9%94_%D8%A7%D8%B5%D9%84%DB%8C",
  }
];

const coursesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COURSES':
      return action.payload;
    case 'REMOVE_COURSE':
      return state.filter(
        course => action.payload.id !== course.id
      )
    default:
      throw new Error();
  }
};

const App = () => {

  const [courses, dispatchCourses] = useReducer(
    coursesReducer,
    []
  );

  const [isLoading, setIsLoading] = useState(false);

  const [searchText, setSearchText] = useState(
    localStorage.getItem('searchText') || ''
  );

  const handleSearch = event => {
    setSearchText(event.target.value);
    localStorage.setItem('searchText', event.target.value);
  }

  const handleRemoveCourse = course => {
    dispatchCourses({
      type: 'REMOVE_COURSE',
      payload: course
    });
  }

  const getCoursesAsync = () =>
    new Promise(resolve =>
      setTimeout(
        () => resolve({ courses: courses_data }),
        2000
      )
    );

  useEffect(() => {
    setIsLoading(true);
    getCoursesAsync().then(result => {
      dispatchCourses({
        type: 'SET_COURSES',
        payload: result.courses
      });
      setIsLoading(false);
    })
  }, []);

  useEffect(() => {
    localStorage.setItem('searchText', searchText)
  }, [searchText]);

  const filteredCourses = courses.filter(course => {
    return course.title.includes(searchText) || course.author.includes(searchText)
  });


  return (
    <div>
      <h1>List of courses</h1>
      <hr />

      <Search value={searchText} onSearch={handleSearch} />

      {isLoading ? (
        <p>Loading Courses ...</p>
      ) : (
          <CoursesList courses={filteredCourses} handleRemoveCourse={handleRemoveCourse} />
        )}

    </div>
  );
}

export default App;
