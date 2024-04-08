import React from "react";

const About = () => {
  return (
    <div className="p-4 md:p-8">
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
      <p className="italic">
        We extend our gratitude to Jeremy Tsai for developing the API and making it available to the
        public.
      </p>
    </div>
  );
};

export default About;
