import React from 'react';

const Skills = () => {
  const skills = [
    { name: 'Python', description: 'Proficient in data analysis, automation, and web development.' },
    { name: 'C++', description: 'Strong understanding of object-oriented programming, algorithms, and system-level programming.' },
    // Add more skills as needed
  ];

  return (
    <div>
      <h2>Skills</h2>
      <ul>
        {skills.map((skill, index) => (
          <li key={index}>
            <strong>{skill.name}</strong>: {skill.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Skills; // Make sure you're using 'export default'