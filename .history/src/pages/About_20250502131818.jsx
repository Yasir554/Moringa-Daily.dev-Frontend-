import React from 'react';
import Footer from '../components/Footer';
import Navbar from './HomeNavbar';

const AboutPage = () => {
  return (
    <>
    
    <div className="bg-white text-gray-800">
      <div>
        
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* About Section */}
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-orange-600 mb-4">About Moringa Daily.dev</h1>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <p className="text-lg leading-relaxed">
              The Moringa Daily.dev platform is built to inspire and inform Moringa students by delivering
              authentic, verified, and practical tech content. Through videos, audio, and blogs, our community 
              shares stories, lessons, and guidance to help each other thrive in tech.
            </p>
            <img
              src="https://images.unsplash.com/photo-1581091012184-5c8af5c8e0f5"
              alt="Moringa Students"
              className="rounded-lg shadow-md w-full"
            />
          </div>
        </section>

        {/* Vision + Mission */}
        <section className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Vision</h2>
            <p className="font-bold mb-1">A world in which anyone can create their future</p>
            <p>
              Our vision is to empower Africans with the skills and opportunities to shape the future
              they envision for themselves.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Mission</h2>
            <p className="font-bold mb-1">
              To build talent and opportunities through transformative tech-based learning
            </p>
            <p>
              We are dedicated to building talent and creating opportunities through tech. As a
              learning accelerator, Moringa School equips high-potential job seekers with in-demand
              skills, bridging the gap in Africa’s job market. Our commitment goes beyond education.
            </p>
          </div>
        </section>

        {/* Quote */}
        <div className="bg-gray-100 p-6 rounded-lg mb-10">
          <p className="italic text-lg text-center text-gray-800">
            "The beautiful thing about learning is that nobody can take it away from you." — B.B. King
          </p>
        </div>

        {/* Content Types */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">What You’ll Find</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Interviews with tech industry experts</li>
            <li>Insights from Moringa School alumni</li>
            <li>Advice and tips from Moringa School staff</li>
            <li>Content in video, audio, and written formats</li>
          </ul>
        </div>

        {/* Tech Grid */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Item 1 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <img
                src="https://i.pinimg.com/474x/32/72/fd/3272fdbde5f3f2a613b4bfa3bc3f9135.jpg"
                alt="Bootcamp"
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl font-bold text-blue-700 mt-4">Coding Bootcamps at Moringa School</h3>
              <p className="text-gray-600">
                A group of students collaborating in coding bootcamps, learning hands-on tech skills in a dynamic environment.
              </p>
            </div>

            {/* Item 2 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <img
                src="https://i.pinimg.com/474x/26/90/04/2690044a5f8a0f9b1c377c17ac89dbbb.jpg"
                alt="Projects"
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl font-bold text-green-700 mt-4">Developing Skills with Real-World Projects</h3>
              <p className="text-gray-600">
                Moringa students gain hands-on experience through real-world projects that prepare them for the tech industry.
              </p>
            </div>

            {/* Item 3 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <img
                src="https://i.pinimg.com/474x/e2/dc/08/e2dc08750bda1a26f6a897985c45dc75.jpg"
                alt="Talks"
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl font-bold text-purple-700 mt-4">Learning from Industry Experts</h3>
              <p className="text-gray-600">
                Moringa School brings industry experts for insightful tech talks, providing valuable knowledge and inspiration.
              </p>
            </div>

            {/* Item 4 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <img
                src="https://i.pinimg.com/474x/7e/91/21/7e9121233769a4a0b040329ac434a7ea.jpg"
                alt="Collaboration"
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl font-bold text-blue-600 mt-4">Collaborating on Group Projects</h3>
              <p className="text-gray-600">
                Students work together on projects, fostering teamwork and problem-solving skills that are essential in tech roles.
              </p>
            </div>

            {/* Item 5 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <img
                src="https://i.pinimg.com/474x/8b/1c/ca/8b1ccafa6f915a3745262f2944bf4a95.jpg"
                alt="Web Dev"
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl font-bold text-green-600 mt-4">Learning Web Development</h3>
              <p className="text-gray-600">
                Moringa School trains students in full-stack web development, including both front-end and back-end technologies.
              </p>
            </div>

            {/* Item 6 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <img
                src="https://i.pinimg.com/474x/db/be/2c/dbbe2c9de6a7ada5037d8e21ffb2765d.jpg"
                alt="Podcasts"
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl font-bold text-orange-600 mt-4">Tech Podcasts and Blogs</h3>
              <p className="text-gray-600">
                Students and alumni share their experiences through podcasts and blogs, providing a platform for tech insights.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-orange-100 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-center text-orange-500 mb-4">Join the Movement!</h2>
          <p className="text-center text-gray-700">
            Together, we build a space for Moringa’s tech voices to be heard, shared, and celebrated. 🚀
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default AboutPage;
