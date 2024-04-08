import React from "react";

const Home = () => {
  return (
    <div className="p-4 md:p-8 flex justify-center">
      <div className="w-11/12 md:w-5/10 text-yellow-100"> 
        <section className="mb-8">
          <h2 className="text-center text-xl md:text-2xl font-bold mb-4">What is LeetCode?</h2>
          <p>
            LeetCode is a popular online platform that offers a vast collection of coding challenges
            aimed at improving coding skills and preparing for software engineering interviews. It
            supports a variety of programming languages and provides a community-driven approach to
            learning and mastering algorithmic programming and coding interview questions.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">What does this web app do?</h2>
          <p>
            This web application leverages the LeetCode Stats API to analyze your coding activity by
            simply entering your LeetCode username. Each LeetCode user has a distinct username, making
            it easy to fetch and display your personalized coding statistics.
          </p>
          <p>
            Upon entering your username, we store your data in our database, which allows us to update
            the leaderboard of LeetCoders in our database. This feature enables users to see where they
            stand among their peers, fostering a sense of community and healthy competition.
          </p>
          <p>
            Additionally, users can create and recommend LeetCode paths, guiding others through
            curated problem sets that target specific areas of software engineering, algorithmic
            thinking, or interview preparation. This collaborative feature enriches the learning
            experience, providing structured guidance and support from the community.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-4">Get Started</h2>
          <p>
            Ready to dive into your LeetCode statistics and see how you stack up against others? Enter
            your username and start exploring your coding journey today. Together, we can make coding
            practice more engaging and productive.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Home;
