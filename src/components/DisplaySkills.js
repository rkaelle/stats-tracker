import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const DisplaySkills = ({ skills, searchTerm, filterCategory, onDelete, showDeleteButton }) => {
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.skill.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? skill.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  const categorizedSkills = filteredSkills.reduce((acc, skill) => {
    const { category, subcategory, skill: skillName, description, count, id } = skill;
    if (!acc[category]) acc[category] = {};
    if (!acc[category][subcategory]) acc[category][subcategory] = [];
    acc[category][subcategory].push({ skillName, description, count, id });
    return acc;
  }, {});

  const handleDelete = async (skillId) => {
    try {
      await deleteDoc(doc(db, 'skills', skillId));
      onDelete(skillId);
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  return (
    <div className="h-full max-h-[675px] overflow-y-auto p-6 bg-white shadow-lg rounded-lg">
      {Object.keys(categorizedSkills).length === 0 ? (
        <p className="text-gray-500 text-center">No skills found</p>
      ) : (
        Object.keys(categorizedSkills).map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-3xl font-bold text-blue-700 border-b-2 border-blue-200 pb-2">{category}</h2>
            <div className="mt-4">
              {Object.keys(categorizedSkills[category]).map((subcategory) => (
                <div key={subcategory} className="mb-6">
                  <h3 className="text-2xl font-semibold text-blue-500">{subcategory}</h3>
                  <ul className="mt-2 space-y-2">
                    {categorizedSkills[category][subcategory].map((item, index) => (
                      <li key={index} className="text-lg text-gray-800 bg-gray-50 p-4 rounded-md shadow-sm hover:bg-gray-100">
                        <div className="flex justify-between items-center">
                          <div>
                            <strong>{item.skillName}</strong>: {item.description}
                          </div>
                          {showDeleteButton && (
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DisplaySkills;