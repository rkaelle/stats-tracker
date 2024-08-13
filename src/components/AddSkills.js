import React, { useState } from 'react';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AddSkills = ({ onSave }) => {
  const [categories, setCategories] = useState({
    Fitness: ['Weightlifting', 'Cardio Activities', 'Sports', 'Nutrition'],
    Academic: ['Courses', 'Certifications', 'Skills'],
    Professional: ['Crypto', 'Work Projects', 'Networking'],
    Projects: ['Personal Projects', 'Group Projects', 'Research'],
    'Personal Development': ['Hobbies', 'Achievements'],
    Technology: ['Programming Languages', 'Tools', 'Frameworks/Libraries'],
    Outdoors: ['Hiking', 'Camping/Backpacking', 'Drones/RC'],
    Leadership: ['Clubs/Organizations', 'Leadership Roles', 'Volunteering'],
    Financial: ['Investments', 'Portfolio Management'],
  });

  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [skill, setSkill] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');  // New state for date

  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory && !categories[newCategory]) {
      setCategories({
        ...categories,
        [newCategory]: [],
      });
      setCategory(newCategory);
      setNewCategory('');
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategory && category && !categories[category].includes(newSubcategory)) {
      setCategories({
        ...categories,
        [category]: [...categories[category], newSubcategory],
      });
      setSubcategory(newSubcategory);
      setNewSubcategory('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const skillRef = collection(db, 'skills');
        const skillQuery = await getDoc(doc(skillRef, `${category}-${subcategory}-${skill}`));

        if (skillQuery.exists()) {
            // If the skill already exists, increment the count
            await updateDoc(doc(skillRef, skillQuery.id), {
                count: skillQuery.data().count + 1,
            });
        } else {
            // If the skill doesn't exist, add it with a count of 1
            const skillData = {
                category,
                subcategory,
                skill,
                description,
                count: 1,
                createdAt: new Date(),
            };

            if (date) {
                // Convert the input date to a Date object and set time to noon
                const inputDate = new Date(date);
                inputDate.setHours(13, 0, 0, 0); // Set the time to noon (12:00 PM)
                skillData.date = inputDate;
            }

            await addDoc(skillRef, skillData);
        }

        onSave({ category, subcategory, skill, description, count: 1, date });

        // Clear form fields
        setCategory('');
        setSubcategory('');
        setSkill('');
        setDescription('');
        setDate('');  // Clear date field
    } catch (e) {
        console.error('Error adding document: ', e);
    }
};
  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white shadow-md rounded-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Category:</label>
          <div className="flex space-x-2">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory(''); // Reset subcategory when category changes
              }}
              required
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select a category</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add Category
            </button>
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Subcategory:</label>
          <div className="flex space-x-2">
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              disabled={!category} // Disable if no category is selected
              required
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select a subcategory</option>
              {category && categories[category].map((subcat) => (
                <option key={subcat} value={subcat}>{subcat}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Add new subcategory"
              value={newSubcategory}
              onChange={(e) => setNewSubcategory(e.target.value)}
              disabled={!category} // Disable if no category is selected
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={handleAddSubcategory}
              disabled={!category}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add Subcategory
            </button>
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Statistic:</label>
          <input
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            required
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700">Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700">Date (optional):</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
          Add Skill
        </button>
      </form>
    </div>
  );
};

export default AddSkills;