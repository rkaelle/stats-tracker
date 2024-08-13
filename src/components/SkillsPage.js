import React, { useState, useEffect } from 'react';
import DisplaySkills from './DisplaySkills'; // Assuming DisplaySkills is a separate component
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Fetch skills data from Firestore
  useEffect(() => {
    const fetchSkills = async () => {
      const querySnapshot = await getDocs(collection(db, 'skills'));
      const skillsData = querySnapshot.docs.map(doc => doc.data());
      setSkills(skillsData);
    };

    fetchSkills();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col items-center p-6">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-blue-700">Ryan Kaelle's Statistics</h1>
        <p className="text-lg text-blue-500 mt-2">Explore and filter through various skills and accomplishments</p>
      </header>

      {/* Search and Filter Section */}
      <div className="w-full max-w-3xl mb-8">
        <input
          type="text"
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-3 w-full border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="mb-4 p-3 w-full border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">All Categories</option>
          {Array.from(new Set(skills.map(skill => skill.category))).map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Skills Display */}
      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg">
        <DisplaySkills skills={skills} searchTerm={searchTerm} filterCategory={filterCategory} />
      </div>
    </div>
  );
};

export default SkillsPage;