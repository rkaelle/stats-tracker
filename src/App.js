import React, { useState, useEffect } from 'react';
import AddSkills from './components/AddSkills';
import DisplaySkills from './components/DisplaySkills';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

function App() {
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const addSkill = (newSkill) => {
    setSkills([...skills, newSkill]);
  };

  const deleteSkill = (skillId) => {
    setSkills(skills.filter(skill => skill.id !== skillId));
  };

  useEffect(() => {
    const fetchSkills = async () => {
      const querySnapshot = await getDocs(collection(db, 'skills'));
      const skillsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setSkills(skillsData);
    };

    fetchSkills();
  }, []);

  return (
    <div className="min-h-screen flex flex-row bg-gray-100">
      <div className="w-1/3 p-4">
        <AddSkills onSave={addSkill} />
      </div>
      <div className="w-2/3 p-4">
        <input
          type="text"
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 w-full border border-gray-300 rounded-md"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="mb-4 p-2 w-full border border-gray-300 rounded-md"
        >
          <option value="">All Categories</option>
          {Array.from(new Set(skills.map(skill => skill.category))).map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <DisplaySkills 
          skills={skills} 
          searchTerm={searchTerm} 
          filterCategory={filterCategory} 
          onDelete={deleteSkill}
          showDeleteButton={true}  // Pass showDeleteButton prop as true
        />
      </div>
    </div>
  );
}

export default App;