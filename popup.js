let selectedRating = 5;  


const FeedbacksTemplate = [
  "The lessons lacked clear organization, and the material felt rushed. I often found it difficult to follow along, and the explanations left me confused. It would help if there was more structure and better pacing in the course.",
  "I struggled to keep up with the course, as the explanations were often vague and difficult to understand. There was not much effort to relate the content to real-world examples or engage students. The course could benefit from more clarity and interaction.",
  "The course objectives for {course} were unclear, and I found the workload overwhelming. The course organization was lacking, which made it hard to keep track of the materials. It would help if the course content was updated and better structured for easier understanding.",
  "I struggled with {course} due to the lack of clear objectives and disorganized materials. The workload felt excessive, and the course did not seem to be updated. The overall structure could be improved to ensure that students can follow along more effectively.",

  "While {teacher} was prepared for class, the material did not always feel relevant or well-structured. I had trouble grasping some key concepts because there was not enough time spent explaining them. More real-world examples would have been helpful to better understand the course content.",
  "The course {course} was a bit disorganized, and I found it challenging to stay engaged. Although the material was presented, it lacked depth, and there were not enough opportunities for active learning. A more interactive approach could greatly improve the learning experience for students.",
  "The course objectives for {course} were somewhat clear, but there were still many points that were left ambiguous. The workload was manageable, but the course organization could have been improved with better access to materials. It would also be helpful if the course content were more up-to-date to reflect current trends and practices.",
  "While {course} was not badly organized, there were still some issues with the flow of content and material availability. The course objectives were clear but could have been communicated more effectively. More up-to-date content and better structure would have enhanced the learning experience.",

  "The teacher, {teacher}, showed a solid understanding of the subject, but some of the lessons felt rushed. I think a bit more time spent on explanations and connecting theory with real-life applications would have made the material easier to grasp and more engaging for the students.",
  "The course {course} was structured well, but I believe it could have been more engaging. There were some useful real-life examples, but a bit more interactive content, like group discussions or activities, would have enhanced the overall experience. More feedback on assignments from {teacher} would also be appreciated to help students improve.",
  "The course {course} had a solid structure, but there were a few areas where things could be more clearly defined. The workload was reasonable, and materials were generally available. There was an effort to update the course content, but some of the examples seemed outdated. A little more clarity in course objectives and structure would have been appreciated.",
  "{course} was well-organized overall, and I felt the objectives were clearly stated. The workload was manageable, and the teaching methods were effective in encouraging participation. However, the course content could benefit from being more up-to-date to reflect current industry practices.",

  "The lessons were generally well-organized, and {teacher} demonstrated clear knowledge of the material in {course}. Some real-world examples helped connect theory to practice, but I believe additional opportunities for class discussions would have made the course even more engaging. Overall, the course was solid, but a bit more student interaction would improve the learning environment.",
  "{teacher} did a great job explaining the course material in {course}, and the course was well-structured. The integration of theory with practical examples was effective, and I felt that the content was relevant. However, more class participation and feedback would have been beneficial in further improving the learning process.",
  "The course objectives for {course} were clear, and the workload was manageable. The course materials were well-organized and easily accessible. I appreciated that the course content was updated and relevant. Overall, the structure of the course was good, and it helped me stay engaged throughout.",
  "{course} was very well-organized, and I had access to all the materials in a timely manner. The content was relevant and up-to-date, and I felt the objectives were clear from the beginning. I particularly liked the well-balanced mix of lectures, tutorials, and practicals.",

  "{teacher} was highly organized and well-prepared for every class in {course}. The course was engaging and the content was always relevant. {teacher} did an excellent job integrating theory with real-world examples. I really appreciated the clear communication and constructive feedback throughout the semester.",
    "{course} exceeded my expectations in terms of organization, clarity, and relevance. The objectives were communicated effectively from day one, and the workload was perfectly balanced. The content was modern and updated, which made the learning process both enjoyable and practical. Overall, the structure was impeccable, and I gained a lot from the course.",
  "The course {course} was excellently organized with clear objectives, a manageable workload, and contemporary content that was both relevant and engaging. The structure of the course was designed to achieve the best learning outcomes, and I found the teaching methods to be very effective in encouraging participation and discussion.",
  "The course {course} was exceptional! The material was presented in a clear and engaging manner, and {teacher} always made sure to explain concepts thoroughly. The inclusion of practical examples helped bridge the gap between theory and practice. I feel much more confident in my understanding of the subject after completing this course."
];


// Star ratings mapped to feedback 
const feedbackStarMapping = {
  1: [0, 1, 2, 3], 
  2: [4, 5, 6, 7], 
  3: [8, 9, 10, 11], 
  4: [12, 13, 14, 15], 
  5: [16, 17, 18, 19]  
};

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize stars
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
      selectedRating = index + 1;
      updateStars();
    });
  });
  updateStars(5); 

 
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getPageInfo,
  }, (results) => {
    if (results && results[0]) {
      const { teacher, course} = results[0].result;
      document.getElementById('teacherName').textContent = teacher;
      document.getElementById('courseName').textContent = course;
    }
  });

  // Generate Comments button
  document.getElementById('generateBtn').addEventListener('click', () => {
    const teacher = document.getElementById('teacherName').textContent;
    const course = document.getElementById('courseName').textContent;


    const feedbackArray =FeedbacksTemplate;
    

    // Select random feedback based on the rating
    const randomIndex = feedbackStarMapping[selectedRating][Math.floor(Math.random() * 4)];
    const selectedFeedback = feedbackArray[randomIndex]
      .replace('{teacher}', teacher)
      .replace('{course}', course);


    document.getElementById('commentBox').value = selectedFeedback;
    updateStars(selectedRating);
  });

  // Fill Form button
  document.getElementById('fillBtn').addEventListener('click', async () => {
    const feedback = document.getElementById('commentBox').value;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: fillForm,
      args: [feedback, selectedRating]
    });
  });
});

function updateStars(rating = selectedRating) {
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, index) => {
    star.classList.toggle('active', index < rating);
  });
}

// This function runs in the context of the webpage
function getPageInfo() {
  const teacher = document.getElementById('ContentPlaceHolder1_txtTeacher')?.value || '';
  const courseSelect = document.getElementById('ContentPlaceHolder1_DDLCourses');
  const course = courseSelect?.options[courseSelect.selectedIndex]?.text || '';
  

  return { teacher, course};
}

// This function runs in the context of the webpage
function fillForm(feedback, rating) {
  // Fill all radio buttons with the selected rating
  const radioInputs = document.querySelectorAll(`input[type='radio'][value='${rating}']`);
  radioInputs.forEach(input => input.click());

  // Fill all textareas with the feedback
  const textAreas = document.querySelectorAll('textarea');
  textAreas.forEach(textArea => {
    textArea.value = feedback;
  });
}

