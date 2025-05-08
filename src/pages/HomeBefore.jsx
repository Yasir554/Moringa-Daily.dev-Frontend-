import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Login from './Login';
import AboutPage from './About';
import NavbarAbout from './NavbarAbout';

const HomeBefore = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        console.log('Token:', token); // Debugging line to ensure the token is retrieved correctly

        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await fetch('http://localhost:5000/api/user', {
          method: 'GET',
          headers: {

            'Authorization': `Bearer ${token}`, // Add token to Authorization header

          },
        });

        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in');
        }

        if (!response.ok) {

          throw new Error(`Failed to fetch user data: ${response.statusText}`);

        }

        const userData = await response.json();
        console.log('User Data:', userData); // Debugging line to check the fetched data
        setUser(userData);  // Assuming the response contains the user data including role
      } catch (err) {
        console.error('Error fetching user data:', err); // Log the error to the console for debugging
        setError(err.message);  // Show the error message to the user
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Loading or Error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }



  return (
    <>
    <NavbarAbout />
      <div className="flex items-center justify-center gap-8 p-8">

        {/* Left Section */}
        <div className="flex flex-col gap-4 max-w-md">
          <h1 className="text-3xl font-bold">Welcome To daily.dev</h1>
          <h3 className="text-xl">
            By Moringa, For Moringa — your hub for <br />
            verified tech insights.
          </h3>
          <p className="text-gray-600">
            A dedicated space built by the Moringa School<br />
            community, for the Moringa School community.<br />
            Here, students, alumni, instructors, and staff come<br />
            together to share authentic and verified knowledge,<br />
            advice, and inspiration about the tech world.
          </p>
        </div>

        <div>
          <img className="h-60" src="/tech.png" alt="tech" />
        </div>
      </div>

      <hr className="border-t-2 border-black my-6 w-full" />
    
    



      <div className="p-4">
        <h1 className="text-orange-500 text-2xl font-bold mb-6">Trending Now</h1>
        <div className="flex flex-wrap gap-6 justify-between">
    
    {/* Card 1 */}
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full sm:w-80">
      <img
        className="h-60 w-full object-cover rounded-2xl"
        src="/techImg.png"
        alt="tech pic"
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold leading-snug mb-2">
          Breaking into DevOps: <br />
          Tips from Alumni
        </h3>

        <div className="flex items-center gap-3 mb-4">
          <img
            className="h-8 w-8 rounded-full object-cover"
            src="/profile.png"
            alt="profile"
          />
          <p className="text-sm font-medium text-gray-700">James</p>
        </div>

        <div className="flex items-center gap-2">
          <img className="h-4 w-4" src="/like.png" alt="Like Icon" />
          <span className="text-sm font-semibold text-gray-600">1300</span>
        </div>
      </div>
    </div>

    

    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full sm:w-80">
      <img
        className="h-60 w-full object-cover rounded-2xl"
        src="/coding.png"
        alt="tech pic"
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold leading-snug mb-2">
          The future of Full-<br/>
          Stack Development 
          
        </h3>

        <div className="flex items-center gap-3 mb-4">
          <img
            className="h-8 w-8 rounded-full object-cover"
            src="/light.png"
            alt="profile"
          />
          <p className="text-sm font-medium text-gray-700">Moringa Staff</p>
        </div>

        <div className="flex items-center gap-2">
          <img className="h-4 w-4" src="/like.png" alt="Like Icon" />
          <span className="text-sm font-semibold text-gray-600">1000</span>
        </div>
      </div>
    </div>

    

    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full sm:w-80">
      <img
        className="h-60 w-full object-cover rounded-2xl"
        src="/developer.png"
        alt="tech pic"
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold leading-snug mb-2">
          Building Responsive UIs <br/>
          with Flexbox <br />
          Tips from Alumni
        </h3>

        <div className="flex items-center gap-3 mb-4">
          <img
            className="h-8 w-8 rounded-full object-cover"
            src="/newpic.png"
            alt="profile"
          />
          <p className="text-sm font-medium text-gray-700">John Doe</p>
        </div>

        <div className="flex items-center gap-2">
          <img className="h-4 w-4" src="/like.png" alt="Like Icon" />
          <span className="text-sm font-semibold text-gray-600">700</span>
        </div>
      </div>
    </div>

  </div>
</div>




<div className='bg-gray-200 p-10 rounded-md text-center'>
  <h1 className='text-orange-500 text-2xl'>Community Voices and Testimonials</h1><br/>
  <div className='bg-blue-900 rounded-lg flex items-center p-5'>
    <div className='flex-1'>
      <p className='text-white'>
        When I joined Moringa School, I was quite overwhelmed at first.<br/>
        It's fast-paced, and it's not like the traditional learning model I was used to.<br/>
        Here we have Technical Mentors who guide you through the curriculum<br/>
        and are there if you need any help. They encourage you to think for yourself,<br/>
        take initiative, and they guide you with your own learning pace.<br/>
        See, I'm not a math person, but I managed to do this as I'm surrounded by...
      </p>
      <br/>
      <p className='text-orange-500 text-xl'>Rose Delilah - Moringa School TM</p>
    </div>
    <img src="/babygirl.png" alt="profile-pic" className="w-48 h-48 rounded-full p-5" />
  </div>
<br/>

<span className="flex items-center gap-4">
  <h1 className="text-2xl font-bold">
    We are Nurturing Africa's Tech Talent
  </h1>
  
  <button className="bg-orange-500 rounded-full p-2">
    <Link to="courses" className="text-white font-bold">
      Explore our Courses
    </Link>
  </button>
</span>


</div>

      <hr className="border-t-2 border-black my-6 w-full" />

<div className='bg-gray-200 p-6 rounded-md'>
  <span className='flex'> 
     <p className='pr-4'>
    Not part of Moringa School Community of Innovators<br/>
    abd Tech Leaders? Join Now
  </p> 
  <a href="https://www.linkedin.com/search/results/all/?fetchDeterministicClustersOnly=true&heroEntityKey=urn%3Ali%3Aorganization%3A4801781&keywords=moringa%20school&origin=RICH_QUERY_TYPEAHEAD_HISTORY&position=0&searchId=090cfa49-60f8-46d4-a2fa-1cd82dc3c75b&sid=vod&spellCorrectionEnabled=true" target="_blank"><button className='bg-orange-500 rounded-full p-1 text-white font-bold'>Join Now</button></a>
  </span>
<p>Be part of a growing community of 8000+ professionals working at learding <br/>
   companies like <strong>IBM</strong>, <strong>Microsoft</strong>, <strong>Toptal</strong>, <strong>Absa Bank</strong> and <strong>Safaricom</strong>.<br/>
   Because when you are signing up, you're not just signing up for a course-<br/>
   you're joining a dynamic, thriving community.
</p>
</div>



<div className="p-10 bg-gray-100 text-center">
  <h1 className="text-3xl font-bold mb-8">Where Our Graduates Work</h1>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
    <img className="h-16 mx-auto" src="/safaricom.png" alt="Safaricom" />
    <img className="h-16 mx-auto" src="/google.png" alt="Google" />
    <img className="h-16 mx-auto" src="/microsoft.png" alt="Microsoft" />
    <img className="h-16 mx-auto" src="/airtel.png" alt="Airtel" />
    <img className="h-16 mx-auto" src="/toptal.png" alt="Toptal" />
    <img className="h-16 mx-auto" src="/absa.png" alt="Absa" />
    <img className="h-16 mx-auto" src="/finsense.png" alt="Finsense" />
    <img className="h-16 mx-auto" src="/im.png" alt="IM" />
    <img className="h-16 mx-auto" src="/jubilee.png" alt="Jubilee" />
    <img className="h-16 mx-auto" src="/credit.png" alt="Credit" />
    <img className="h-16 mx-auto" src="/optica.png" alt="Optica" />
    <img className="h-16 mx-auto" src="/delberg.png" alt="Delberg" />
    <img className="h-16 mx-auto" src="/prime.png" alt="Prime" />
    <img className="h-16 mx-auto" src="/zamara.png" alt="Zamara" />
    <img className="h-16 mx-auto" src="/naivas.png" alt="Naivas" />
    <img className="h-16 mx-auto" src="/deloitte.png" alt="Deloitte" />
    <img className="h-16 mx-auto" src="/cellulant.png" alt="Cellulant" />
    <img className="h-16 mx-auto" src="/ncba.png" alt="NCBA" />
    <img className="h-16 mx-auto" src="/little.png" alt="Little" />
    <img className="h-16 mx-auto" src="/bdo.png" alt="BDO" />
    <img className="h-16 mx-auto" src="/ey.png" alt="EY" />
    <img className="h-16 mx-auto" src="/airways.png" alt="Kenya Airways" />
    <img className='h-16' src="/equity.png" alt="Equity" />
    <img className='h-16' src="/kra.png" alt="Kenya Revenue Authority" />

  </div>
</div>

    </>
  );
};


export default HomeBefore;
