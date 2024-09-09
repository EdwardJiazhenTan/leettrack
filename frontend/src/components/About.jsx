import React from "react";

const About = () => {
  return (
    <div className="p-4 md:p-8 w-4/5 mx-auto text-yellow-100">
      <h1 className="text-center text-2xl md:text-4xl font-bold mb-4">About LeetCode Stats App</h1>
      <p className="mb-2">
        This website is a project for CSC261 at the University of Rochester. It's designed to display
        users' LeetCode statistics in a visually appealing manner, aiding in the tracking of progress
        and performance over time.
      </p>
      <p className="mb-2">
        The LeetCode Stats App was developed by Edward Tan and Yuyang Wang, as part of the coursework
        for project 3 in CSC261. The goal of this project is to provide an easy-to-use interface for
        retrieving and displaying coding problem statistics from LeetCode, helping users to better
        understand their coding journey.
      </p>
      <p className="mb-2">
        The data displayed by this website is sourced from the open-source repository available at{" "}
        <a
          href="https://github.com/JeremyTsaii/leetcode-stats-api"
          className="text-purple-500 hover:text-purple-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/JeremyTsaii/leetcode-stats-api
        </a>. This API is an independent project that aggregates publicly available data from
        LeetCode's official site.
      </p>
      <p className="italic mb-2">
        We extend our gratitude to Jeremy Tsai for developing the API and making it available to the
        public.
      </p>
      <p>
        The frontend of this app was built using React and Tailwind CSS, while the backend was developed
        in Flask and utilizes MySQL for database management. This combination of technologies provides
        a robust framework for efficient and scalable web application development.
      </p>
      <h1 className="text-center text-2xl md:text-4xl font-bold mb-4">Highlights</h1>
      <p>
        We used React to build the frontend of the website.
      </p>
      <p>
        We used React Spring to create the animations on the home page.
      </p>
      <p>
        We used Tailwind CSS to style the components and make the website responsive.
      </p>
      <p>
        We used Axios to fetch data from the LeetCode Stats API.
      </p>
      <p>
        We used React Router to handle navigation between different pages.
      </p>
      <p>
        We used Python Flask to create the backend server that interacts with the MySQL database.
      </p>
    </div>
  );
};

export default About;
