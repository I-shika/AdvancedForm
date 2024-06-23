import './form.css'

import React, { useState, useEffect } from 'react';

// Custom hook for form handling
const useForm = (initialValues, validate, fetchAdditionalQuestions) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [additionalQuestions, setAdditionalQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // State to hold user answers

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleAdditionalQuestionChange = (e, index) => {
    const { value } = e.target;
    setAnswers({
      ...answers,
      [index]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setIsSubmitting(true);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      if (values.surveyTopic) {
        const questions = await fetchAdditionalQuestions(values.surveyTopic);
        setAdditionalQuestions(questions);
        setAnswers({}); // Reset answers when questions change
      } else {
        setAdditionalQuestions([]);
      }
    };

    fetchQuestions();
  }, [values.surveyTopic, fetchAdditionalQuestions]);

  useEffect(() => {
    if (isSubmitting && Object.keys(errors).length === 0) {
      alert(`Form submitted successfully!\n${JSON.stringify(values, null, 2)}\nAdditional Questions:\n${JSON.stringify(answers, null, 2)}`);
      setIsSubmitting(false);
    }
  }, [errors, isSubmitting, values, answers]);

  return {
    values,
    errors,
    additionalQuestions,
    answers,
    handleChange,
    handleAdditionalQuestionChange,
    handleSubmit,
  };
};


// Validation function
const validate = (values) => {
  let errors = {};
  if (!values.fullName) errors.fullName = 'Full Name is required';
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email address is invalid';
  }
  if (!values.surveyTopic) errors.surveyTopic = 'Survey Topic is required';
  
  if (values.surveyTopic === 'Technology') {
    if (!values.favoriteProgrammingLanguage) errors.favoriteProgrammingLanguage = 'Favorite Programming Language is required';
    if (!values.yearsOfExperience || values.yearsOfExperience <= 0) errors.yearsOfExperience = 'Years of Experience is required and must be greater than 0';
  }
  if (values.surveyTopic === 'Health') {
    if (!values.exerciseFrequency) errors.exerciseFrequency = 'Exercise Frequency is required';
    if (!values.dietPreference) errors.dietPreference = 'Diet Preference is required';
  }
  if (values.surveyTopic === 'Education') {
    if (!values.highestQualification) errors.highestQualification = 'Highest Qualification is required';
    if (!values.fieldOfStudy) errors.fieldOfStudy = 'Field of Study is required';
  }
  if (!values.feedback || values.feedback.length < 50) errors.feedback = 'Feedback is required and must be at least 50 characters';
  
  return errors;
};

// Mock function to fetch additional questions from an external API
const fetchAdditionalQuestions = async (topic) => {
  // Mock data
  const additionalQuestions = {
    Technology: [
      { question: 'What is your favorite tech stack?' },
      { question: 'How do you stay updated with the latest tech trends?' },
    ],
    Health: [
      { question: 'How many hours do you sleep daily?' },
      { question: 'Do you have any allergies?' },
    ],
    Education: [
      { question: 'What is your favorite subject?' },
      { question: 'Do you prefer online or offline classes?' },
    ],
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(additionalQuestions[topic] || []);
    }, 1000);
  });
};

const SurveyForm = () => {
  const initialValues = {
    fullName: '',
    email: '',
    surveyTopic: '',
    favoriteProgrammingLanguage: '',
    yearsOfExperience: '',
    exerciseFrequency: '',
    dietPreference: '',
    highestQualification: '',
    fieldOfStudy: '',
    feedback: '',
  };

  const { values, errors, additionalQuestions, answers, handleChange, handleAdditionalQuestionChange, handleSubmit } = useForm(
    initialValues,
    validate,
    fetchAdditionalQuestions
  );

  return (
    <div className="container">
      <h2>Survey Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p className="error">{errors.fullName}</p>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div>
          <label>Survey Topic:</label>
          <select name="surveyTopic" value={values.surveyTopic} onChange={handleChange}>
            <option value="">Select a topic</option>
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
          </select>
          {errors.surveyTopic && <p className="error">{errors.surveyTopic}</p>}
        </div>
        {values.surveyTopic === 'Technology' && (
          <div>
            <label>Favorite Programming Language:</label>
            <select name="favoriteProgrammingLanguage" value={values.favoriteProgrammingLanguage} onChange={handleChange}>
              <option value="">Select a language</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C#">C#</option>
            </select>
            {errors.favoriteProgrammingLanguage && <p className="error">{errors.favoriteProgrammingLanguage}</p>}
            <div>
              <label>Years of Experience:</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={values.yearsOfExperience}
                onChange={handleChange}
              />
              {errors.yearsOfExperience && <p className="error">{errors.yearsOfExperience}</p>}
            </div>
          </div>
        )}
        {values.surveyTopic === 'Health' && (
          <div>
            <label>Exercise Frequency:</label>
            <select name="exerciseFrequency" value={values.exerciseFrequency} onChange={handleChange}>
              <option value="">Select frequency</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Rarely">Rarely</option>
            </select>
            {errors.exerciseFrequency && <p className="error">{errors.exerciseFrequency}</p>}
            <div>
              <label>Diet Preference:</label>
              <select name="dietPreference" value={values.dietPreference} onChange={handleChange}>
                <option value="">Select preference</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
              {errors.dietPreference && <p className="error">{errors.dietPreference}</p>}
            </div>
          </div>
        )}
        {values.surveyTopic === 'Education' && (
          <div>
            <label>Highest Qualification:</label>
            <select name="highestQualification" value={values.highestQualification} onChange={handleChange}>
              <option value="">Select qualification</option>
              <option value="High School">High School</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="PhD">PhD</option>
            </select>
            {errors.highestQualification && <p className="error">{errors.highestQualification}</p>}
            <div>
              <label>Field of Study:</label>
              <input
                type="text"
                name="fieldOfStudy"
                value={values.fieldOfStudy}
                onChange={handleChange}
              />
              {errors.fieldOfStudy && <p className="error">{errors.fieldOfStudy}</p>}
            </div>
          </div>
        )}
        {additionalQuestions.length > 0 && (
          <div className="additional-questions">
            <h3>Additional Questions</h3>
            {additionalQuestions.map((question, index) => (
              <div key={index}>
                <label>{question.question}</label>
                <input
                  type="text"
                  value={answers[index] || ''}
                  onChange={(e) => handleAdditionalQuestionChange(e, index)}
                />
              </div>
            ))}
          </div>
        )}
        <div>
          <label>Feedback:</label>
          <textarea
            name="feedback"
            value={values.feedback}
            onChange={handleChange}
          />
          {errors.feedback && <p className="error">{errors.feedback}</p>}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SurveyForm;


